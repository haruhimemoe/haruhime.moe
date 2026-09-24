/**
 * @file tests/unit/utils/security-txt.test.ts
 * @desc buildSecurityTxt: RFC 9116 fields in order, absolute links, expiry 365 days out, one
 *       trailing newline.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

import { describe, expect, it } from "vitest";
import { buildSecurityTxt } from "@/utils/security-txt";

describe("buildSecurityTxt", () => {
  const now = new Date("2026-09-23T00:00:00.000Z");
  const text = buildSecurityTxt(now);
  const lines = text.split("\n");

  it("has the RFC 9116 fields in order", () => {
    expect(lines).toEqual([
      "Contact: mailto:contact@haruhime.moe",
      "Expires: 2027-09-23T00:00:00.000Z",
      "Preferred-Languages: en",
      "Canonical: https://haruhime.moe/.well-known/security.txt",
      "Policy: https://github.com/haruhimemoe/haruhime.moe/blob/main/SECURITY.md",
      "",
    ]);
  });

  it("expires 365 days after now, in ISO 8601 UTC", () => {
    const expires = new Date(/^Expires: (.+)$/m.exec(text)?.[1] ?? "");
    expect(expires.getTime() - now.getTime()).toBe(365 * 24 * 60 * 60 * 1000);
    expect(expires.toISOString()).toBe(/^Expires: (.+)$/m.exec(text)?.[1]);
  });

  it("only uses absolute links", () => {
    expect(text).toContain("mailto:contact@haruhime.moe");
    expect(text).toContain("https://haruhime.moe/.well-known/security.txt");
    expect(text).toContain("https://github.com/haruhimemoe/haruhime.moe/blob/main/SECURITY.md");
  });

  it("ends with exactly one trailing newline", () => {
    expect(text.endsWith("\n")).toBe(true);
    expect(text.endsWith("\n\n")).toBe(false);
  });
});
