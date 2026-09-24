/**
 * @file tests/unit/app/sitemap.test.ts
 * @desc sitemap.xml lists every page, and robots.txt allows everything and points at it.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

describe("sitemap", () => {
  it("lists every page on the live domain", () => {
    expect(sitemap().map((entry) => entry.url)).toEqual([
      "https://haruhime.moe/",
      "https://haruhime.moe/thanks",
      "https://haruhime.moe/brand",
      "https://haruhime.moe/contact",
      "https://haruhime.moe/disclaimer",
    ]);
  });
});

describe("robots", () => {
  it("allows everything and names the sitemap", () => {
    expect(robots()).toEqual({
      rules: [{ userAgent: "*", allow: "/" }],
      sitemap: "https://haruhime.moe/sitemap.xml",
    });
  });
});
