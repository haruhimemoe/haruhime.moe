/**
 * @file tests/unit/constants/legal.test.ts
 * @desc The pinned date: security.txt's Expires is valid ISO 8601 UTC, under a year out, and
 *       more than 60 days away (so CI fails in time to bump it and redeploy).
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Sep 28, 2026
 * @modified Sun Oct 4, 2026
 */

import { describe, expect, it } from "vitest";
import { SECURITY_TXT_EXPIRES } from "@/constants/legal";

const DAY_MS = 24 * 60 * 60 * 1000;

describe("SECURITY_TXT_EXPIRES", () => {
  const expires = new Date(SECURITY_TXT_EXPIRES);

  it("is ISO 8601 UTC", () => {
    expect(expires.toISOString()).toBe(SECURITY_TXT_EXPIRES);
  });

  it("is under a year out (RFC 9116)", () => {
    expect(expires.getTime() - Date.now()).toBeLessThanOrEqual(366 * DAY_MS);
  });

  it("is more than 60 days away: bump it and redeploy when this fails", () => {
    expect(expires.getTime() - Date.now()).toBeGreaterThan(60 * DAY_MS);
  });
});
