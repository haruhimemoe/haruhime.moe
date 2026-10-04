/**
 * @file tests/unit/utils/changelog.test.ts
 * @desc parseChangelog on real files (ui's and this site's CHANGELOG.md) and on the ways a
 *       hand-written file drifts: unbracketed Unreleased, no date, an impossible date, a
 *       pre-release, unknown ### sections, a repeated section or version, wrapped and multi-line
 *       items with nested lists and code, link definitions, CRLF, empty and junk input. Also
 *       releaseAnchor and sectionMarkdown.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Sun Oct 4, 2026
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parseChangelog, releaseAnchor, sectionMarkdown } from "@/utils/changelog";

const fixture = (name: string): string =>
  readFileSync(path.join(process.cwd(), "tests/fixtures/changelog", name), "utf8");

describe("parseChangelog on real files", () => {
  it("reads ui's ten releases newest first, with dates, sections and link definitions", () => {
    const log = parseChangelog(fixture("ui.md"));
    expect(log.unreleased).toEqual([]);
    expect(log.releases.map((r) => r.version)).toEqual([
      "0.9.0",
      "0.8.0",
      "0.7.0",
      "0.6.0",
      "0.5.1",
      "0.5.0",
      "0.4.0",
      "0.3.0",
      "0.2.0",
      "0.1.0",
    ]);
    const [newest] = log.releases;
    expect(newest?.date).toBe("2026-10-03");
    expect(newest?.sections.map((s) => [s.name, s.items.length])).toEqual([
      ["Added", 4],
      ["Changed", 2],
    ]);
    expect(newest?.sections[0]?.items[0]).toMatch(/^`@haruhimemoe\/ui\/mdx`: `mdxComponents`/);
    expect(log.references).toHaveLength(11);
    expect(log.references[0]).toBe(
      "[unreleased]: https://github.com/haruhimemoe/ui/compare/v0.9.0...HEAD",
    );
  });

  it("reads this site's file, where items in one section are split by blank lines", () => {
    const log = parseChangelog(fixture("haruhime.moe.md"));
    expect(log.releases.map((r) => [r.version, r.date])).toEqual([
      ["0.2.0", "2026-10-04"],
      ["0.1.0", "2026-09-24"],
    ]);
    const added = log.releases[0]?.sections.find((s) => s.name === "Added");
    expect(added?.items).toHaveLength(6);
    const changed = log.releases[0]?.sections.find((s) => s.name === "Changed");
    expect(changed?.items.some((item) => item.startsWith("Each live tool's homepage card"))).toBe(
      true,
    );
    for (const item of changed?.items ?? []) expect(item).not.toMatch(/^\s|\s$/);
  });
});

describe("parseChangelog on drift", () => {
  it("takes Unreleased with or without brackets, in any case", () => {
    for (const heading of ["## [Unreleased]", "## Unreleased", "## [unreleased]"]) {
      const log = parseChangelog(`${heading}\n\n### Fixed\n\n- a fix\n`);
      expect(log.unreleased).toEqual([{ name: "Fixed", items: ["a fix"] }]);
    }
  });

  it("takes a release without brackets, without a date, or with a pre-release suffix", () => {
    const log = parseChangelog(
      "## 1.2.0 - 2026-01-02\n### Added\n- a\n## [1.1.0]\n### Added\n- b\n## [1.0.0-beta.1] - 2025-12-01\n### Added\n- c\n",
    );
    expect(log.releases.map((r) => [r.version, r.date])).toEqual([
      ["1.2.0", "2026-01-02"],
      ["1.1.0", null],
      ["1.0.0-beta.1", "2025-12-01"],
    ]);
  });

  it("keeps a release with a [YANKED] tag or an en dash, and its date", () => {
    const log = parseChangelog(
      "## [1.0.0] - 2026-01-01 [YANKED]\n### Added\n- a\n## [0.9.0] – 2025-12-01\n### Added\n- b\n",
    );
    expect(log.releases.map((r) => [r.version, r.date])).toEqual([
      ["1.0.0", "2026-01-01"],
      ["0.9.0", "2025-12-01"],
    ]);
  });

  it("gives an impossible or malformed date null", () => {
    const log = parseChangelog("## [1.0.0] - 2026-13-01\n## [0.9.0] - soon\n");
    expect(log.releases.map((r) => r.date)).toEqual([null, null]);
  });

  it("skips an unknown ### section with its items, and any other ## block", () => {
    const log = parseChangelog(
      "## [1.0.0] - 2026-01-01\n### Docs\n- hidden\n### Fixed\n- shown\n## Notes\n### Added\n- also hidden\n",
    );
    expect(log.releases).toEqual([
      { version: "1.0.0", date: "2026-01-01", sections: [{ name: "Fixed", items: ["shown"] }] },
    ]);
  });

  it("drops a version whose anchor repeats an earlier one", () => {
    const log = parseChangelog("## [1.0.0-beta.1]\n## [1.0.0-beta-1]\n");
    expect(log.releases.map((r) => r.version)).toEqual(["1.0.0-beta.1"]);
  });

  it("merges a repeated section and drops a repeated version", () => {
    const log = parseChangelog(
      "## [1.0.0] - 2026-01-01\n### Added\n- a\n### Added\n- b\n## [1.0.0] - 2025-01-01\n### Added\n- c\n",
    );
    expect(log.releases).toEqual([
      { version: "1.0.0", date: "2026-01-01", sections: [{ name: "Added", items: ["a", "b"] }] },
    ]);
  });

  it("keeps a wrapped line, a nested list and a fenced code block inside one item", () => {
    const log = parseChangelog(
      [
        "## [1.0.0] - 2026-01-01",
        "### Changed",
        "- first line",
        "wrapped line",
        "  - nested one",
        "  - nested two",
        "",
        "  ```ts",
        "  - not an item",
        "",
        "  ## not a heading",
        "  ```",
        "- second",
      ].join("\n"),
    );
    const items = log.releases[0]?.sections[0]?.items;
    expect(items).toEqual([
      "first line\nwrapped line\n  - nested one\n  - nested two\n\n  ```ts\n  - not an item\n\n  ## not a heading\n  ```",
      "second",
    ]);
  });

  it("ends an item at an unindented paragraph after a blank line", () => {
    const log = parseChangelog("## [1.0.0] - 2026-01-01\n### Added\n- a\n\nstray text\n- b\n");
    expect(log.releases[0]?.sections[0]?.items).toEqual(["a", "b"]);
  });

  it("handles CRLF line endings", () => {
    const log = parseChangelog("## [Unreleased]\r\n\r\n### Added\r\n\r\n- a\r\n");
    expect(log.unreleased).toEqual([{ name: "Added", items: ["a"] }]);
  });

  it("drops empty sections and never throws on empty or junk input", () => {
    expect(parseChangelog("")).toEqual({ unreleased: [], releases: [], references: [] });
    expect(parseChangelog("## [Unreleased]\n### Added\n")).toEqual({
      unreleased: [],
      releases: [],
      references: [],
    });
    expect(() => parseChangelog("\u0000###\n- \n##\n[\n```")).not.toThrow();
  });

  it("ignores items before any section", () => {
    expect(parseChangelog("- loose\n## [Unreleased]\n- loose too\n").unreleased).toEqual([]);
  });
});

describe("releaseAnchor", () => {
  it("turns a version into an id: v plus the version with dashes", () => {
    expect(releaseAnchor("0.9.0")).toBe("v0-9-0");
    expect(releaseAnchor("1.0.0-beta.1")).toBe("v1-0-0-beta-1");
  });
});

describe("sectionMarkdown", () => {
  it("renders the items as a Markdown list, with the link definitions after it", () => {
    expect(sectionMarkdown({ name: "Added", items: ["a", "b\n  - c"] })).toBe("- a\n- b\n  - c");
    expect(sectionMarkdown({ name: "Added", items: ["see [x]"] }, ["[x]: https://x.y"])).toBe(
      "- see [x]\n\n[x]: https://x.y",
    );
  });
});
