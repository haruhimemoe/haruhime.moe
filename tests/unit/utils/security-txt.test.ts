/**
 * @file tests/unit/utils/security-txt.test.ts
 * @desc buildSecurityTxt: RFC 9116 fields in order, absolute links, the pinned expiry by default,
 *       one trailing newline.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Mon Sep 28, 2026
 */

import { describe, expect, it } from "vitest";
import { SECURITY_TXT_EXPIRES } from "@/constants/legal";
import { buildSecurityTxt } from "@/utils/security-txt";

describe("buildSecurityTxt", () => {
  const text = buildSecurityTxt("2027-09-23T00:00:00.000Z");
  const lines = text.split("\n");

  it("has the RFC 9116 fields in order", () => {
    expect(lines).toEqual([
      "Contact: mailto:contact@haruhime.moe",
      "Expires: 2027-09-23T00:00:00.000Z",
      "Preferred-Languages: en",
      "Canonical: https://www.haruhime.moe/.well-known/security.txt",
      "Policy: https://github.com/haruhimemoe/haruhime.moe/blob/main/SECURITY.md",
      "",
    ]);
  });

  it("uses the pinned SECURITY_TXT_EXPIRES by default", () => {
    expect(buildSecurityTxt()).toContain(`Expires: ${SECURITY_TXT_EXPIRES}\n`);
  });

  it("only uses absolute links", () => {
    expect(text).toContain("mailto:contact@haruhime.moe");
    expect(text).toContain("https://www.haruhime.moe/.well-known/security.txt");
    expect(text).toContain("https://github.com/haruhimemoe/haruhime.moe/blob/main/SECURITY.md");
  });

  it("ends with exactly one trailing newline", () => {
    expect(text.endsWith("\n")).toBe(true);
    expect(text.endsWith("\n\n")).toBe(false);
  });
});
