/**
 * @file tests/unit/utils/llms-full.test.ts
 * @desc buildLlmsFull: the head title and summary, one document per part in order (brand, every
 *       library, then every legal page from the content registry), each with its absolute source URL, the brand facts,
 *       each library's real description and install line, each legal page's sections (the terms text once), absolute
 *       links only, one trailing newline. With changelogs: a document per loaded repo after the
 *       libraries (three newest releases each, "No releases yet." when a loaded repo has none),
 *       skipped for a repo that failed, no documents at all with no argument.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sat Oct 3, 2026
 * @modified Tue Oct 6, 2026
 */

import { beforeAll, describe, expect, it } from "vitest";
import { BRAND_COLORS } from "@/constants/brand";
import { CHANGELOG_SOURCES } from "@/constants/changelogs";
import { LIBRARIES } from "@/constants/libraries";
import { SITE } from "@/constants/site";
import { buildLlmsFull } from "@/utils/llms-full";

describe("buildLlmsFull", () => {
  let text = "";
  beforeAll(async () => {
    text = await buildLlmsFull();
  });

  it("opens with the head title and summary, then a document per part in order", () => {
    const titles = [...text.matchAll(/^# (.+)$/gm)].map((m) => m[1]);
    expect(titles).toEqual([
      `${SITE.name}: brand, libraries, changelogs and legal`,
      "Brand",
      ...LIBRARIES.map((library) => library.pkg),
      "Terms",
      "Privacy",
      "Your Privacy Rights",
      "Copyright",
      "Disclaimers",
    ]);
    expect(text).toContain(`> ${SITE.description}`);
  });

  it("has no changelog parts when called with no argument", () => {
    const titles = [...text.matchAll(/^# (.+)$/gm)].map((m) => m[1]);
    for (const source of CHANGELOG_SOURCES) {
      expect(titles).not.toContain(`${source.label} changelog`);
    }
  });

  it("gives every document an absolute Source link", () => {
    expect(text).toContain(`Source: ${SITE.url}/brand`);
    for (const library of LIBRARIES) {
      expect(text).toContain(`Source: ${SITE.url}/libraries/${library.name}`);
    }
    expect(text).toContain(`Source: ${SITE.url}/legal/terms`);
    expect(text).toContain(`Source: ${SITE.url}/legal/privacy`);
    expect(text).toContain(`Source: ${SITE.url}/legal/your-privacy-rights`);
    expect(text).toContain(`Source: ${SITE.url}/legal/copyright`);
    expect(text).toContain(`Source: ${SITE.url}/legal/disclaimers`);
  });

  it("carries the brand page's real facts: the name rule, the colors and the osu! notice", () => {
    expect(text).toContain('The name is written "haruhime.moe" in lower case');
    for (const color of BRAND_COLORS) expect(text).toContain(`${color.name}: ${color.hex}`);
    expect(text).toContain(SITE.trademarkNotice);
  });

  it("carries each library's real description and install line, never a placeholder", () => {
    for (const library of LIBRARIES) {
      expect(text).toContain(library.description);
      expect(text).toContain(`Install: \`bun add ${library.pkg}\``);
    }
  });

  it("carries each legal page's sections", () => {
    expect(text).toContain("## Not affiliated");
    expect(text).toContain("## Beatmaps belong to their creators");
    expect(text).toContain("## The libraries");
    expect(text).toContain("## Disclaimer of warranties");
    expect(text).toContain("## What we store");
    expect(text).toContain("## Service providers");
    expect(text).toContain("## Your rights under the GDPR");
    expect(text).toContain("## Copyright and DMCA");
  });

  it("carries the terms text exactly once, from content/legal/terms.mdx", () => {
    const line = "Using the site means you accept these terms.";
    expect(text.split(line)).toHaveLength(2);
  });

  it("makes the legal pages' own links absolute", () => {
    expect(text).toContain(`[Libraries](${SITE.url}/libraries)`);
    expect(text).not.toContain("](/");
  });

  it("separates documents with a horizontal rule", () => {
    expect(text).toContain("\n\n---\n\n");
  });

  it("ends with exactly one trailing newline", () => {
    expect(text.endsWith("\n")).toBe(true);
    expect(text.endsWith("\n\n")).toBe(false);
  });
});

describe("buildLlmsFull with changelogs", () => {
  const ui = CHANGELOG_SOURCES.find((s) => s.slug === "ui") as (typeof CHANGELOG_SOURCES)[number];
  const pools = CHANGELOG_SOURCES.find(
    (s) => s.slug === "pools",
  ) as (typeof CHANGELOG_SOURCES)[number];
  const releases = ["0.4.0", "0.3.0", "0.2.0", "0.1.0"].map((version) => ({
    version,
    date: "2026-10-01",
    sections: [{ name: "Added" as const, items: [`thing ${version}`] }],
  }));
  let text = "";
  beforeAll(async () => {
    text = await buildLlmsFull([
      { source: ui, changelog: { unreleased: [], releases, references: [] } },
      { source: pools, error: true },
    ]);
  });

  it("adds a document per loaded repo after the libraries, three newest releases each", () => {
    const titles = [...text.matchAll(/^# (.+)$/gm)].map((m) => m[1]);
    expect(titles).toContain("ui changelog");
    expect(titles).not.toContain("pools changelog");
    expect(titles.indexOf("ui changelog")).toBeGreaterThan(titles.indexOf("@haruhimemoe/brand"));
    expect(text).toContain(`Source: ${SITE.url}/changelog/ui`);
    expect(text).toContain("## 0.4.0 (2026-10-01)");
    expect(text).toContain("- thing 0.2.0");
    expect(text).not.toContain("thing 0.1.0");
  });

  it("says a loaded repo with no releases has none yet", async () => {
    const nextKit = CHANGELOG_SOURCES.find(
      (s) => s.slug === "next-kit",
    ) as (typeof CHANGELOG_SOURCES)[number];
    const empty = await buildLlmsFull([
      { source: nextKit, changelog: { unreleased: [], releases: [], references: [] } },
    ]);
    const titles = [...empty.matchAll(/^# (.+)$/gm)].map((m) => m[1]);
    expect(titles).toContain("next-kit changelog");
    expect(empty).toContain("No releases yet.");
  });

  it("keeps the link definitions so reference-style links in items resolve", async () => {
    const osu = CHANGELOG_SOURCES.find(
      (s) => s.slug === "osu",
    ) as (typeof CHANGELOG_SOURCES)[number];
    const withRefs = await buildLlmsFull([
      {
        source: osu,
        changelog: {
          unreleased: [],
          releases: [
            {
              version: "0.2.0",
              date: "2026-10-01",
              sections: [{ name: "Added", items: ["[x] docs"] }],
            },
          ],
          references: ["[x]: https://example.com/x"],
        },
      },
    ]);
    expect(withRefs).toContain("- [x] docs");
    expect(withRefs).toContain("[x]: https://example.com/x");
  });

  it("drops the parenthesized date for an undated release", async () => {
    const osu = CHANGELOG_SOURCES.find(
      (s) => s.slug === "osu",
    ) as (typeof CHANGELOG_SOURCES)[number];
    const undated = await buildLlmsFull([
      {
        source: osu,
        changelog: {
          unreleased: [],
          releases: [{ version: "0.1.0", date: null, sections: [] }],
          references: [],
        },
      },
    ]);
    expect(undated).toContain("## 0.1.0\n");
    expect(undated).not.toContain("## 0.1.0 (");
  });
});
