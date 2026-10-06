/**
 * @file tests/unit/content/registry.test.ts
 * @desc The content registry, the MDX loaders and the files under content/ name the same pages,
 *       so no page builds without its file and no file sits unregistered. haruhime.moe has legal
 *       pages only, each with a search title that fits.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Mon Oct 5, 2026
 */

import { contentFileDrift } from "@haruhimemoe/next-kit/docs/files";
import { expect, it } from "vitest";
import { CONTENT, LEGAL_SEO_TITLES } from "@/constants/content";
import { LOADERS } from "@/content/load";

it("registry, loaders and files agree", () => {
  expect(contentFileDrift(CONTENT)).toEqual({ missingFiles: [], unregistered: [] });
  for (const s of CONTENT.sections)
    expect(Object.keys(LOADERS[s] ?? {}).sort()).toEqual(
      CONTENT.entries[s].map((e) => e.slug).sort(),
    );
});

it("has legal only: no docs (no API) and no guides", () => {
  expect(CONTENT.sections).toEqual(["legal"]);
  expect(CONTENT.entries.legal.map((e) => e.slug)).toEqual([
    "terms",
    "privacy",
    "your-privacy-rights",
    "copyright",
    "disclaimers",
  ]);
});

it("gives every legal page a search title under 60 characters with the suffix", () => {
  for (const e of CONTENT.entries.legal) {
    const title = LEGAL_SEO_TITLES[e.slug];
    expect(title).toBeTruthy();
    expect(`${title} · haruhime.moe`.length).toBeLessThan(60);
  }
});

it("keeps each description between 140 and 160 characters", () => {
  for (const e of CONTENT.entries.legal) {
    expect(e.description.length).toBeGreaterThanOrEqual(140);
    expect(e.description.length).toBeLessThanOrEqual(160);
  }
});
