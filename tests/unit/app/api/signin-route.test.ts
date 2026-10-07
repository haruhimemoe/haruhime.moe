/**
 * @file tests/unit/app/api/signin-route.test.ts
 * @desc GET /api/signin/osu: 302 straight to osu! with better-auth's state cookie, callbackURL
 *       is the checked `next` and errorCallbackURL the hub's /signin carrying it, an unsafe or
 *       looping `next` falls back to /account, a signed-in visitor goes through /signin, an
 *       over-limit IP gets the limiter's answer, and a failed start lands on /signin?error=.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { beforeEach, describe, expect, it, vi } from "vitest";

const getUserFromHeaders = vi.fn();
const signInSocial = vi.fn();
const refuseOverLimit = vi.fn();
vi.mock("@/lib/auth", () => ({
  getUserFromHeaders: (h: Headers) => getUserFromHeaders(h),
  getAuth: () => ({ api: { signInSocial: (input: unknown) => signInSocial(input) } }),
}));
vi.mock("@/lib/rate-limit", () => ({
  limiter: { refuseOverLimit: (rule: unknown, subject: string) => refuseOverLimit(rule, subject) },
}));
vi.mock("@/env", () => ({ getServerEnv: () => ({ BETTER_AUTH_URL: "https://haruhime.moe" }) }));

const { GET } = await import("@/app/api/signin/osu/route");

const OSU = "https://osu.ppy.sh/oauth/authorize?state=abc";
const STATE_COOKIE = "__Secure-better-auth.state=xyz; Path=/; HttpOnly; Secure; SameSite=Lax";

const get = (query: string) =>
  GET(
    new Request(`https://haruhime.moe/api/signin/osu${query}`, {
      headers: { "x-real-ip": "1.2.3.4" },
    }),
  );

beforeEach(() => {
  getUserFromHeaders.mockReset();
  getUserFromHeaders.mockResolvedValue(null);
  refuseOverLimit.mockReset();
  refuseOverLimit.mockResolvedValue(null);
  signInSocial.mockReset();
  signInSocial.mockResolvedValue({
    headers: new Headers([["set-cookie", STATE_COOKIE]]),
    response: { url: OSU, redirect: false },
  });
});

describe("GET /api/signin/osu", () => {
  it("302s to osu! with the state cookie and the checked next", async () => {
    const response = await get(`?next=${encodeURIComponent("https://bb.haruhime.moe/b/1")}`);
    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toBe(OSU);
    expect(response.headers.getSetCookie()).toEqual([STATE_COOKIE]);
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(signInSocial).toHaveBeenCalledWith(
      expect.objectContaining({
        body: {
          provider: "osu",
          callbackURL: "https://bb.haruhime.moe/b/1",
          errorCallbackURL: `https://haruhime.moe/signin?next=${encodeURIComponent("https://bb.haruhime.moe/b/1")}`,
          disableRedirect: true,
        },
        returnHeaders: true,
      }),
    );
    expect(refuseOverLimit).toHaveBeenCalledWith(
      expect.objectContaining({ scope: "signin" }),
      "1.2.3.4",
    );
  });

  it.each([
    "",
    "?next=https://evil.com/",
    "?next=//evil.com",
    `?next=${encodeURIComponent("https://haruhime.moe/api/signin/osu?next=x")}`,
    "?next=/signin",
  ])("falls back to /account for %s", async (query) => {
    await get(query);
    expect(signInSocial.mock.calls[0]?.[0].body.callbackURL).toBe("/account");
  });

  it("sends a signed-in visitor through /signin", async () => {
    getUserFromHeaders.mockResolvedValue({ id: "u1" });
    const response = await get("?next=/brand");
    expect(response.headers.get("location")).toBe("https://haruhime.moe/signin?next=%2Fbrand");
    expect(signInSocial).not.toHaveBeenCalled();
  });

  it("answers over the limit with the limiter's response", async () => {
    refuseOverLimit.mockResolvedValue(new Response(null, { status: 429 }));
    expect((await get("?next=/brand")).status).toBe(429);
    expect(signInSocial).not.toHaveBeenCalled();
  });

  it("lands on /signin with an error when the start fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    signInSocial.mockRejectedValue(new Error("db down"));
    const response = await get("?next=/brand");
    expect(response.headers.get("location")).toBe(
      "https://haruhime.moe/signin?next=%2Fbrand&error=please_restart_the_process",
    );
  });
});
