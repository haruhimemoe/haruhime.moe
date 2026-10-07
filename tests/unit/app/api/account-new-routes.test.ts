/**
 * @file tests/unit/app/api/account-new-routes.test.ts
 * @desc The 0.15 routes: Discord link answers 404 while unconfigured and rate-limits by IP when
 *       on, export is 401 for a visitor and downloads only the caller's bundle, the inbox refuses
 *       a wrong bearer, and PATCH locale checks sign-in, cross-site and the locale list.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const getUserFromHeaders = vi.fn();
const limitUser = vi.fn();
const refuseOverLimit = vi.fn();
const hit = vi.fn();
const exportAccount = vi.fn();
const updateOne = vi.fn();
vi.mock("@/lib/auth", () => ({ getUserFromHeaders: (h: Headers) => getUserFromHeaders(h) }));
vi.mock("@/lib/rate-limit", () => ({
  limitUser: (rule: unknown, user: unknown) => limitUser(rule, user),
  limiter: {
    refuseOverLimit: (rule: unknown, subject: unknown) => refuseOverLimit(rule, subject),
    hit: (rule: unknown, subject: unknown) => hit(rule, subject),
  },
}));
vi.mock("@/lib/account-data", () => ({ exportAccount: (id: string) => exportAccount(id) }));
vi.mock("@/lib/db", () => ({
  connectDb: async () => {},
  getIdentityDb: () => ({ collection: () => ({ updateOne, findOne: async () => null }) }),
}));
vi.mock("@/lib/inbox", () => ({ inboxStore: { add: vi.fn(), deleteFor: vi.fn() } }));

const start = await import("@/app/api/account/discord/start/route");
const callback = await import("@/app/api/account/discord/callback/route");
const unlink = await import("@/app/api/account/discord/route");
const exportRoute = await import("@/app/api/account/export/route");
const locale = await import("@/app/api/account/locale/route");
const inbox = await import("@/app/api/internal/inbox/route");

const USER = {
  id: "0123456789abcdef01234567",
  osuId: 7,
  username: "haruhime",
  avatarUrl: null,
  sessionId: "s1",
};
const BASE = "http://localhost:3000";
const req = (path: string, init: RequestInit = {}, origin = BASE) =>
  new Request(`${BASE}${path}`, {
    method: "POST",
    ...init,
    headers: { origin, "content-type": "application/json", ...init.headers },
  });

beforeEach(() => {
  vi.unstubAllEnvs();
  vi.stubEnv("DISCORD_CLIENT_ID", "");
  vi.stubEnv("DISCORD_CLIENT_SECRET", "");
  getUserFromHeaders.mockResolvedValue(USER);
  limitUser.mockReset().mockResolvedValue(null);
  refuseOverLimit.mockReset().mockResolvedValue(null);
  exportAccount.mockReset();
  hit.mockReset().mockResolvedValue({ allowed: true });
  updateOne.mockReset();
});

describe("Discord link routes", () => {
  it("answer 404 while Discord isn't configured, without counting", async () => {
    expect((await start.POST(req("/api/account/discord/start"))).status).toBe(404);
    expect((await unlink.POST(req("/api/account/discord"))).status).toBe(404);
    expect(
      (await callback.GET(req("/api/account/discord/callback?code=x", { method: "GET" }))).status,
    ).toBe(404);
    expect(refuseOverLimit).not.toHaveBeenCalled();
  });

  it("rate-limits start and callback by IP once configured", async () => {
    vi.stubEnv("DISCORD_CLIENT_ID", "id");
    vi.stubEnv("DISCORD_CLIENT_SECRET", "secret");
    refuseOverLimit.mockResolvedValue(new Response(null, { status: 429 }));
    expect((await start.POST(req("/api/account/discord/start"))).status).toBe(429);
    const res = await callback.GET(req("/api/account/discord/callback", { method: "GET" }));
    expect(res.status).toBe(429);
    expect(res.headers.get("cache-control")).toContain("no-store");
    expect(refuseOverLimit).toHaveBeenCalledWith(
      expect.objectContaining({ scope: "discord-link" }),
      expect.anything(),
    );
  });
});

describe("GET /api/account/export", () => {
  it("is 401 signed out", async () => {
    getUserFromHeaders.mockResolvedValue(null);
    expect((await exportRoute.GET(req("/api/account/export", { method: "GET" }))).status).toBe(401);
    expect(exportAccount).not.toHaveBeenCalled();
  });

  it("is rate-limited per account", async () => {
    limitUser.mockResolvedValue(new Response(null, { status: 429 }));
    const res = await exportRoute.GET(req("/api/account/export", { method: "GET" }));
    expect(res.status).toBe(429);
    expect(limitUser).toHaveBeenCalledWith(
      expect.objectContaining({ scope: "account-export" }),
      USER,
    );
    expect(exportAccount).not.toHaveBeenCalled();
  });

  it("downloads the caller's own bundle, uncached", async () => {
    exportAccount.mockResolvedValue({ exportedAt: "x", identity: { name: "haruhime" }, apps: {} });
    const res = await exportRoute.GET(req("/api/account/export", { method: "GET" }));
    expect(res.status).toBe(200);
    expect(exportAccount).toHaveBeenCalledWith(USER.id);
    expect(res.headers.get("content-disposition")).toContain("haruhime-7.json");
    expect(res.headers.get("cache-control")).toContain("no-store");
    expect((await res.json()).identity).toEqual({ name: "haruhime" });
  });
});

describe("PATCH /api/account/locale", () => {
  const patch = (body: string, origin = BASE) =>
    locale.PATCH(req("/api/account/locale", { method: "PATCH", body }, origin));

  it("is 401 signed out", async () => {
    getUserFromHeaders.mockResolvedValue(null);
    expect((await patch('{"locale":"en"}')).status).toBe(401);
  });

  it("refuses cross-site", async () => {
    expect((await patch('{"locale":"en"}', "https://pools.haruhime.moe")).status).toBe(403);
    expect(updateOne).not.toHaveBeenCalled();
  });

  it("refuses an unknown locale or extra keys", async () => {
    expect((await patch('{"locale":"xx"}')).status).toBe(400);
    expect((await patch('{"locale":"en","admin":true}')).status).toBe(400);
    expect(updateOne).not.toHaveBeenCalled();
  });

  it("saves a known locale on the caller", async () => {
    const res = await patch('{"locale":"en"}');
    expect(res.status).toBe(204);
    expect(updateOne).toHaveBeenCalledWith(expect.anything(), { $set: { locale: "en" } });
    expect(String(updateOne.mock.calls[0]?.[0]._id)).toBe(USER.id);
  });
});

describe("POST /api/internal/inbox", () => {
  it("refuses a missing or wrong bearer", async () => {
    vi.stubEnv("ACCOUNT_SECRET_PACKS", "right-secret-right-secret-right-secret");
    const none = await inbox.POST(req("/api/internal/inbox", { body: "{}" }));
    expect(none.status).toBe(401);
    const wrong = await inbox.POST(
      req("/api/internal/inbox", { body: "{}", headers: { authorization: "Bearer nope" } }),
    );
    expect(wrong.status).toBe(401);
    expect(hit).toHaveBeenCalledWith(
      expect.objectContaining({ scope: "inbox-failures" }),
      expect.anything(),
    );
  });

  it("is 503 while no app has a secret", async () => {
    vi.stubEnv("ACCOUNT_SECRET_BB", "");
    vi.stubEnv("ACCOUNT_SECRET_PACKS", "");
    vi.stubEnv("ACCOUNT_SECRET_POOLS", "");
    const res = await inbox.POST(
      req("/api/internal/inbox", { body: "{}", headers: { authorization: "Bearer x" } }),
    );
    expect(res.status).toBe(503);
  });
});
