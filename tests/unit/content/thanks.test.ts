/**
 * @file tests/unit/content/thanks.test.ts
 * @desc Thanks data shape: names, optional https links, one line each.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

import { describe, expect, it } from "vitest";
import { THANKS } from "@/content/thanks";

describe("THANKS", () => {
  it("has entries", () => {
    expect(THANKS.length).toBeGreaterThan(0);
  });

  it("has unique, non-empty names", () => {
    const names = THANKS.map((entry) => entry.name);
    expect(names.every((name) => name.trim().length > 0)).toBe(true);
    expect(new Set(names).size).toBe(names.length);
  });

  it.each(THANKS.map((entry) => [entry.name, entry] as const))(
    "%s has one line and, if linked, an https URL",
    (_name, entry) => {
      expect(entry.line.trim().length).toBeGreaterThan(0);
      expect(entry.line).not.toContain("\n");
      if (entry.url !== undefined) {
        expect(new URL(entry.url).protocol).toBe("https:");
      }
      expect(Object.keys(entry).every((key) => ["name", "url", "line"].includes(key))).toBe(true);
    },
  );

  it("keeps the seed entries", () => {
    expect(THANKS.map((entry) => entry.url)).toEqual(
      expect.arrayContaining([
        "https://github.com/hburn7/omc-api",
        "https://mirror.hinamizawa.ai",
        "https://osu.ppy.sh",
      ]),
    );
  });
});
