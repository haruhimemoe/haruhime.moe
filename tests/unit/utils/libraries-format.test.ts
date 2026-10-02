/**
 * @file tests/unit/utils/libraries-format.test.ts
 * @desc Stat text: counts shorten past a thousand, a release reads as tag and day in UTC, and a
 *       failed lookup shows a dash or "no release yet", never "null" or "Invalid Date".
 * @author David @dvhsh (https://dvh.sh)
 * @created Fri Oct 2, 2026
 * @modified Fri Oct 2, 2026
 */

import { describe, expect, it } from "vitest";
import { formatCount, formatRelease, MISSING } from "@/utils/libraries-format";

describe("formatCount", () => {
  it.each([
    [0, "0"],
    [999, "999"],
    [1000, "1k"],
    [1234, "1.2k"],
    [9950, "10k"],
    [34_567, "35k"],
    [null, MISSING],
  ])("%s → %s", (count, text) => {
    expect(formatCount(count)).toBe(text);
  });
});

describe("formatRelease", () => {
  it("reads as the tag and the day, in UTC", () => {
    expect(formatRelease({ tag: "v0.6.0", publishedAt: "2026-09-28T23:59:00Z" })).toBe(
      "v0.6.0, Sep 28, 2026",
    );
  });

  it("says no release yet for null", () => {
    expect(formatRelease(null)).toBe("no release yet");
  });
});
