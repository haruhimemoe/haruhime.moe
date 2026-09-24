/**
 * @file tests/unit/utils/date.test.ts
 * @desc formatIsoDate: calendar dates in words, same in every timezone; bad input throws.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

import { describe, expect, it } from "vitest";
import { formatIsoDate } from "@/utils/date";

describe("formatIsoDate", () => {
  it("formats a date without shifting it a day west of UTC", () => {
    expect(formatIsoDate("2026-09-23")).toBe("September 23, 2026");
    expect(formatIsoDate("2026-01-01")).toBe("January 1, 2026");
  });

  it.each(["2026-9-23", "not a date", "2026-02-30", ""])("rejects %j", (value) => {
    expect(() => formatIsoDate(value)).toThrow(RangeError);
  });
});
