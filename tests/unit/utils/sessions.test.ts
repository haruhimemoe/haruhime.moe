/**
 * @file tests/unit/utils/sessions.test.ts
 * @desc describeDevice's guesses (Edge, Opera and Chrome told apart, Android and iOS before Linux
 *       and macOS) and formatSessionDay in UTC.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { describe, expect, it } from "vitest";
import { describeDevice, formatSessionDay } from "@/utils/sessions";

const UA = {
  chromeWin:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36",
  edgeWin:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36 Edg/140.0",
  operaMac:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36 OPR/120.0",
  firefoxLinux: "Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0",
  safariIphone:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
  chromeAndroid:
    "Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Mobile Safari/537.36",
  chromeOs:
    "Mozilla/5.0 (X11; CrOS x86_64 15000.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36",
};

describe("describeDevice", () => {
  it.each([
    [UA.chromeWin, "Chrome on Windows"],
    [UA.edgeWin, "Edge on Windows"],
    [UA.operaMac, "Opera on macOS"],
    [UA.firefoxLinux, "Firefox on Linux"],
    [UA.safariIphone, "Safari on iOS"],
    [UA.chromeAndroid, "Chrome on Android"],
    [UA.chromeOs, "Chrome on ChromeOS"],
  ])("reads %s", (ua, expected) => {
    expect(describeDevice(ua)).toBe(expected);
  });

  it("falls back to what it can tell", () => {
    expect(describeDevice("curl/8.0 (Linux)")).toBe("Linux");
    expect(describeDevice("Something Firefox/1.0")).toBe("Firefox");
    expect(describeDevice("curl/8.0")).toBe("Unknown device");
    expect(describeDevice(null)).toBe("Unknown device");
    expect(describeDevice(undefined)).toBe("Unknown device");
  });
});

describe("formatSessionDay", () => {
  it("formats a day in UTC, from a Date or a string", () => {
    expect(formatSessionDay(new Date("2026-10-07T03:00:00Z"))).toBe("Oct 7, 2026");
    expect(formatSessionDay("2026-10-06T12:00:00Z")).toBe("Oct 6, 2026");
  });

  it("says unknown for an invalid date", () => {
    expect(formatSessionDay("nope")).toBe("unknown");
  });
});
