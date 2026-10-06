/**
 * @file tests/unit/constants/changelogs.test.ts
 * @desc CHANGELOG_SOURCES lists this site, every live tool, every library and the plugin once
 *       each, with unique slugs; changelogUrls points at the raw file, GitHub and the page here;
 *       the kind segments and nav headings match; unknown slugs and segments (prototype keys too)
 *       miss.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Tue Oct 6, 2026
 */

import { describe, expect, it } from "vitest";
import {
  CHANGELOG_SOURCES,
  changelogUrls,
  findChangelogSource,
  isKindSegment,
  KIND_HEADINGS,
  KIND_SEGMENTS,
} from "@/constants/changelogs";
import { LIBRARIES } from "@/constants/libraries";
import { TOOLS } from "@/constants/tools";

describe("CHANGELOG_SOURCES", () => {
  it("lists the site, the live tools, the libraries, then the plugin", () => {
    expect(CHANGELOG_SOURCES.map((s) => [s.slug, s.repo, s.kind])).toEqual([
      ["haruhime.moe", "haruhime.moe", "app"],
      ...TOOLS.filter((t) => t.url).map((t) => [t.name, `${t.name}.haruhime.moe`, "app"]),
      ...LIBRARIES.map((l) => [l.name, l.repo, "package"]),
      ["claude-plugin", "claude-plugin", "plugin"],
    ]);
    expect(CHANGELOG_SOURCES.find((s) => s.slug === "claude-plugin")?.label).toBe("Claude plugin");
  });

  it("never lists a tool that hasn't launched, and every slug is unique", () => {
    for (const tool of TOOLS.filter((t) => !t.url)) {
      expect(findChangelogSource(tool.name)).toBeUndefined();
    }
    const slugs = CHANGELOG_SOURCES.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("findChangelogSource", () => {
  it("finds a listed slug and misses anything else", () => {
    expect(findChangelogSource("ui")?.kind).toBe("package");
    // "kind" would be shadowed by the static /changelog/kind folder.
    for (const slug of ["nope", "__proto__", "constructor", "", "kind"]) {
      expect(findChangelogSource(slug)).toBeUndefined();
    }
  });
});

describe("changelogUrls", () => {
  it("points at the raw file, the file and releases on GitHub, and the page here", () => {
    const packs = findChangelogSource("packs");
    expect(packs && changelogUrls(packs)).toEqual({
      page: "/changelog/packs",
      raw: "https://raw.githubusercontent.com/haruhimemoe/packs.haruhime.moe/main/CHANGELOG.md",
      file: "https://github.com/haruhimemoe/packs.haruhime.moe/blob/main/CHANGELOG.md",
      github: "https://github.com/haruhimemoe/packs.haruhime.moe",
      releases: "https://github.com/haruhimemoe/packs.haruhime.moe/releases",
    });
  });
});

describe("KIND_SEGMENTS and KIND_HEADINGS", () => {
  it("maps apps and packages to their kinds, and nothing else is a segment", () => {
    expect(KIND_SEGMENTS.apps.kind).toBe("app");
    expect(KIND_SEGMENTS.packages.kind).toBe("package");
    expect(isKindSegment("apps")).toBe(true);
    for (const value of ["plugin", "__proto__", "toString", "app"]) {
      expect(isKindSegment(value)).toBe(false);
    }
  });

  it("heads the nav groups Apps, Packages, then Claude plugin", () => {
    expect(Object.entries(KIND_HEADINGS)).toEqual([
      ["app", "Apps"],
      ["package", "Packages"],
      ["plugin", "Claude plugin"],
    ]);
  });
});
