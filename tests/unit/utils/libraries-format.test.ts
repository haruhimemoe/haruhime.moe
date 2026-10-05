/**
 * @file tests/unit/utils/libraries-format.test.ts
 * @desc Stat text: counts shorten past a thousand, a release reads as tag and day in UTC, a
 *       failed lookup shows a dash or "no release yet", never "null" or "Invalid Date", and
 *       libraryStatItems labels the four stats in order.
 * @author David @dvhsh (https://dvh.sh)
 * @created Fri Oct 2, 2026
 * @modified Mon Oct 5, 2026
 */

import { describe, expect, it } from "vitest";
import { formatCount, formatRelease, libraryStatItems, MISSING } from "@/utils/libraries-format";

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

describe("libraryStatItems", () => {
  it("labels version, downloads, stars and the latest release", () => {
    const items = libraryStatItems({
      version: "0.6.0",
      license: "MIT",
      downloads: 1234,
      stars: 7,
      release: { tag: "v0.6.0", publishedAt: "2026-09-28T20:35:00Z" },
    });
    expect(items.map((i) => i.label)).toEqual([
      "Version",
      "Downloads / month",
      "Stars",
      "Latest release",
    ]);
    expect(items.map((i) => i.value)).toEqual(["0.6.0", "1.2k", "7", "v0.6.0, Sep 28, 2026"]);
  });

  it("shows a dash and no release yet when the lookups failed", () => {
    const items = libraryStatItems({
      version: null,
      license: null,
      downloads: null,
      stars: null,
      release: null,
    });
    expect(items.map((i) => i.value)).toEqual(["—", "—", "—", "no release yet"]);
  });
});
