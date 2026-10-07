/**
 * @file tests/unit/env.test.ts
 * @desc The hub's env: the five osu! app variables parse (names, never values, in errors), and
 *       HUB_COOKIE_DOMAIN is optional, lowercased, and must be a dot and a hostname.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { EnvError } from "@haruhimemoe/next-kit/env";
import { describe, expect, it } from "vitest";
import { getHubCookieDomain, parseServerEnv, SERVER_ENV_KEYS } from "@/env";

const TEST_OSU_APP_ENV = {
  MONGODB_URI: "mongodb://127.0.0.1:27017",
  BETTER_AUTH_SECRET: "a-test-secret-that-is-at-least-32-chars",
  BETTER_AUTH_URL: "http://localhost:3000",
  OSU_CLIENT_ID: "12345",
  OSU_CLIENT_SECRET: "osu-test-client-secret",
};

describe("parseServerEnv", () => {
  it("accepts the osu! app's five variables", () => {
    expect(parseServerEnv({ ...TEST_OSU_APP_ENV })).toMatchObject({
      BETTER_AUTH_URL: TEST_OSU_APP_ENV.BETTER_AUTH_URL,
    });
    expect(SERVER_ENV_KEYS).toEqual([
      "MONGODB_URI",
      "BETTER_AUTH_SECRET",
      "BETTER_AUTH_URL",
      "OSU_CLIENT_ID",
      "OSU_CLIENT_SECRET",
    ]);
  });

  it("names a missing secret without printing values", () => {
    const { BETTER_AUTH_SECRET: _, ...rest } = TEST_OSU_APP_ENV;
    expect(() => parseServerEnv(rest)).toThrow(EnvError);
    expect(() => parseServerEnv(rest)).toThrow(/BETTER_AUTH_SECRET/);
    expect(() => parseServerEnv(rest)).not.toThrow(new RegExp(TEST_OSU_APP_ENV.OSU_CLIENT_SECRET));
  });
});

describe("getHubCookieDomain", () => {
  it("is undefined when unset or blank", () => {
    expect(getHubCookieDomain({})).toBeUndefined();
    expect(getHubCookieDomain({ HUB_COOKIE_DOMAIN: "  " })).toBeUndefined();
  });

  it("returns a parent domain, lowercased", () => {
    expect(getHubCookieDomain({ HUB_COOKIE_DOMAIN: ".haruhime.moe" })).toBe(".haruhime.moe");
    expect(getHubCookieDomain({ HUB_COOKIE_DOMAIN: " .Haruhime.MOE " })).toBe(".haruhime.moe");
    expect(getHubCookieDomain({ HUB_COOKIE_DOMAIN: ".localhost" })).toBe(".localhost");
  });

  it.each(["haruhime.moe", ".", "..haruhime.moe", ".haruhime.moe/", "https://haruhime.moe"])(
    "refuses %s, naming the variable",
    (value) => {
      expect(() => getHubCookieDomain({ HUB_COOKIE_DOMAIN: value })).toThrow(/HUB_COOKIE_DOMAIN/);
    },
  );
});
