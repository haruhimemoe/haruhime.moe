/**
 * @file tests/unit/utils/length.test.ts
 * @desc formatLength and parseLength: m:ss both ways, whole minutes, and text that isn't a length.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

import { describe, expect, it } from "vitest";
import { formatLength, parseLength } from "@/utils/length";

describe("formatLength", () => {
  it.each([
    [0, "0:00"],
    [5, "0:05"],
    [60, "1:00"],
    [125, "2:05"],
    [600, "10:00"],
    [89.6, "1:30"],
    [-3, "0:00"],
  ])("%s seconds is %s", (seconds, text) => {
    expect(formatLength(seconds)).toBe(text);
  });
});

describe("parseLength", () => {
  it.each([
    ["2:05", 125],
    [" 10:00 ", 600],
    ["0:59", 59],
    ["3", 180],
  ])("reads %j as %s seconds", (text, seconds) => {
    expect(parseLength(text)).toBe(seconds);
  });

  it.each(["", "2:5", "2:60", "1:2:3", "abc", "1.5", "-1:00"])("rejects %j", (text) => {
    expect(parseLength(text)).toBeNull();
  });

  it("round-trips with formatLength", () => {
    for (const seconds of [0, 59, 61, 312, 600]) {
      expect(parseLength(formatLength(seconds))).toBe(seconds);
    }
  });
});
