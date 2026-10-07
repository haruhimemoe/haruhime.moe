/**
 * @file tests/unit/utils/signin.test.ts
 * @desc resolveNext: same-site paths, full URLs on the exact allowed hosts only (never a suffix,
 *       userinfo, http or a loop back to /signin), the fallback otherwise. signInErrorText: each
 *       code's line, the last of several, and none.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { describe, expect, it } from "vitest";
import { HUB_HOSTS } from "@/constants/accounts";
import { resolveNext, SIGN_IN_ERRORS, signInErrorText } from "@/utils/signin";

const opts = { hosts: HUB_HOSTS, fallback: "/account" };

describe("resolveNext", () => {
  it("falls back without a next", () => {
    expect(resolveNext(undefined, opts)).toBe("/account");
    expect(resolveNext("", opts)).toBe("/account");
    expect(resolveNext([], opts)).toBe("/account");
  });

  it("keeps a same-site path and refuses an unsafe one", () => {
    expect(resolveNext("/account", opts)).toBe("/account");
    expect(resolveNext("/libraries/ui", opts)).toBe("/libraries/ui");
    expect(resolveNext("//evil.com", opts)).toBe("/account");
    expect(resolveNext("/signin?next=/x", opts)).toBe("/account");
    expect(resolveNext("/\\evil.com", opts)).toBe("/account");
  });

  it("takes the first of several", () => {
    expect(resolveNext(["/brand", "https://evil.com"], opts)).toBe("/brand");
  });

  it("keeps a URL on a satellite, normalized", () => {
    expect(resolveNext("https://pools.haruhime.moe/p/abc", opts)).toBe(
      "https://pools.haruhime.moe/p/abc",
    );
    expect(resolveNext("https://PACKS.haruhime.moe", opts)).toBe("https://packs.haruhime.moe/");
    expect(resolveNext("https://bb.haruhime.moe/collab?x=1", opts)).toBe(
      "https://bb.haruhime.moe/collab?x=1",
    );
  });

  it.each([
    "https://evil.com/",
    "https://haruhime.moe.evil.com/",
    "https://evilharuhime.moe/",
    "https://haruhime.moe@evil.com/",
    "https://user:pass@pools.haruhime.moe/",
    "http://pools.haruhime.moe/",
    "https://new.haruhime.moe/",
    "javascript:alert(1)",
    "https://pools.haruhime.moe/signin",
    "https://www.haruhime.moe/signin/x",
    "pools.haruhime.moe",
  ])("refuses %s", (raw) => {
    expect(resolveNext(raw, opts)).toBe("/account");
  });
});

describe("signInErrorText", () => {
  it("is null without an error", () => {
    expect(signInErrorText(undefined)).toBeNull();
    expect(signInErrorText("")).toBeNull();
  });

  it("explains each known code", () => {
    for (const { codes, text } of SIGN_IN_ERRORS) {
      for (const code of codes) expect(signInErrorText(code)).toBe(text);
    }
  });

  it("uses the last of several, and a plain line for anything else", () => {
    expect(signInErrorText(["oauth", "access_denied"])).toContain("cancelled");
    expect(signInErrorText("something_new")).toBe("Sign-in didn't finish. Try again.");
  });
});
