/**
 * @file tests/unit/utils/llms-full.test.ts
 * @desc buildLlmsFull: the head title and summary, one document per part in order (brand, every
 *       library, then the three legal pages), each with its absolute source URL, the brand facts,
 *       each library's real description and install line, each legal page's sections, absolute
 *       links only, one trailing newline.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sat Oct 3, 2026
 * @modified Sat Oct 3, 2026
 */

import { describe, expect, it } from "vitest";
import { BRAND_COLORS } from "@/constants/brand";
import { LIBRARIES } from "@/constants/libraries";
import { SITE } from "@/constants/site";
import { buildLlmsFull } from "@/utils/llms-full";

describe("buildLlmsFull", () => {
  const text = buildLlmsFull();

  it("opens with the head title and summary, then a document per part in order", () => {
    const titles = [...text.matchAll(/^# (.+)$/gm)].map((m) => m[1]);
    expect(titles).toEqual([
      `${SITE.name}: brand, libraries and legal`,
      "Brand",
      ...LIBRARIES.map((library) => library.pkg),
      "Disclaimer",
      "Terms",
      "Privacy",
    ]);
    expect(text).toContain(`> ${SITE.description}`);
  });

  it("gives every document an absolute Source link", () => {
    expect(text).toContain(`Source: ${SITE.url}/brand`);
    for (const library of LIBRARIES) {
      expect(text).toContain(`Source: ${SITE.url}/libraries/${library.name}`);
    }
    expect(text).toContain(`Source: ${SITE.url}/disclaimer`);
    expect(text).toContain(`Source: ${SITE.url}/terms`);
    expect(text).toContain(`Source: ${SITE.url}/privacy`);
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
    expect(text).toContain("## No warranty");
    expect(text).toContain("## What this site collects");
    expect(text).toContain("## Library stats");
  });

  it("separates documents with a horizontal rule", () => {
    expect(text).toContain("\n\n---\n\n");
  });

  it("ends with exactly one trailing newline", () => {
    expect(text.endsWith("\n")).toBe(true);
    expect(text.endsWith("\n\n")).toBe(false);
  });
});
