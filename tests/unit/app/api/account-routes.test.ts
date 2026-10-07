/**
 * @file tests/unit/app/api/account-routes.test.ts
 * @desc The account routes: 401 for a visitor, 403 cross-site (a sibling subdomain included),
 *       DELETE /api/account checks the typed username, rate-limits by osu! id, and clears the
 *       marker, the session routes revoke by id (never this session) or every other one.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { beforeEach, describe, expect, it, vi } from "vitest";

const getUserFromHeaders = vi.fn();
const deleteIdentity = vi.fn();
const revokeSession = vi.fn();
const revokeOtherSessions = vi.fn();
const limitUser = vi.fn();
vi.mock("@/lib/auth", () => ({ getUserFromHeaders: (h: Headers) => getUserFromHeaders(h) }));
vi.mock("@/lib/sessions", () => ({
  deleteIdentity: (id: string) => deleteIdentity(id),
  revokeSession: (u: string, s: string) => revokeSession(u, s),
  revokeOtherSessions: (u: string, s: string) => revokeOtherSessions(u, s),
}));
const fanOutReport = vi.fn();
vi.mock("@/lib/account-data", () => ({
  deleteAccount: async (user: { id: string }) => {
    const report = fanOutReport();
    if (report.ok) deleteIdentity(user.id);
    return report;
  },
}));
vi.mock("@/lib/rate-limit", () => ({
  limitUser: (rule: unknown, user: unknown) => limitUser(rule, user),
}));

const account = await import("@/app/api/account/route");
const sessions = await import("@/app/api/account/sessions/route");
const session = await import("@/app/api/account/sessions/[id]/route");

const USER = { id: "u1", osuId: 1, username: "haruhime", avatarUrl: null, sessionId: "s1" };
const URL_BASE = "http://localhost:3000";

const req = (path: string, init: RequestInit = {}, origin = URL_BASE) =>
  new Request(`${URL_BASE}${path}`, {
    method: "DELETE",
    ...init,
    headers: { origin, "content-type": "application/json", ...init.headers },
  });

const ctx = (id: string) => ({ params: Promise.resolve({ id }) }) as never;

beforeEach(() => {
  vi.unstubAllEnvs();
  getUserFromHeaders.mockResolvedValue(USER);
  deleteIdentity.mockReset();
  fanOutReport.mockReturnValue({ ok: true, results: [] });
  revokeSession.mockResolvedValue(true);
  revokeOtherSessions.mockResolvedValue(2);
  limitUser.mockReset();
  limitUser.mockResolvedValue(null);
});

describe("DELETE /api/account", () => {
  it("is 502 and keeps the identity when an app fails", async () => {
    fanOutReport.mockReturnValue({
      ok: false,
      results: [{ id: "packs", ok: false, status: 0, error: "not_configured" }],
    });
    const res = await account.DELETE(
      req("/api/account", { body: JSON.stringify({ username: "haruhime" }) }),
    );
    expect(res.status).toBe(502);
    expect((await res.json()).error.message).toContain("packs");
    expect(deleteIdentity).not.toHaveBeenCalled();
  });

  it("is 401 signed out", async () => {
    getUserFromHeaders.mockResolvedValue(null);
    expect((await account.DELETE(req("/api/account"))).status).toBe(401);
  });

  it("refuses a sibling subdomain", async () => {
    const response = await account.DELETE(
      req("/api/account", { body: '{"username":"haruhime"}' }, "https://pools.haruhime.moe"),
    );
    expect(response.status).toBe(403);
    expect(deleteIdentity).not.toHaveBeenCalled();
  });

  it("refuses a wrong username", async () => {
    const response = await account.DELETE(req("/api/account", { body: '{"username":"Haruhime"}' }));
    expect(response.status).toBe(400);
    expect(deleteIdentity).not.toHaveBeenCalled();
  });

  it("deletes the identity and clears the marker on the parent domain", async () => {
    vi.stubEnv("HUB_COOKIE_DOMAIN", ".haruhime.moe");
    const response = await account.DELETE(
      req("/api/account", { body: '{"username":" haruhime "}' }),
    );
    expect(response.status).toBe(204);
    expect(deleteIdentity).toHaveBeenCalledWith("u1");
    expect(limitUser).toHaveBeenCalledWith(
      expect.objectContaining({ scope: "account-delete" }),
      USER,
    );
    expect(response.headers.get("set-cookie")).toBe(
      "haruhime-signed-in=; Path=/; Max-Age=0; SameSite=Lax; Domain=.haruhime.moe",
    );
    expect(response.headers.get("cache-control")).toContain("no-store");
  });

  it("is rate-limited before the account is touched", async () => {
    limitUser.mockResolvedValue(new Response(null, { status: 429 }));
    const response = await account.DELETE(req("/api/account", { body: '{"username":"haruhime"}' }));
    expect(response.status).toBe(429);
    expect(deleteIdentity).not.toHaveBeenCalled();
  });
});

describe("DELETE /api/account/sessions", () => {
  it("is 401 signed out", async () => {
    getUserFromHeaders.mockResolvedValue(null);
    expect((await sessions.DELETE(req("/api/account/sessions"))).status).toBe(401);
  });

  it("signs every other session out", async () => {
    const response = await sessions.DELETE(req("/api/account/sessions"));
    expect(await response.json()).toEqual({ revoked: 2 });
    expect(revokeOtherSessions).toHaveBeenCalledWith("u1", "s1");
  });
});

describe("DELETE /api/account/sessions/[id]", () => {
  it("refuses cross-site", async () => {
    const response = await session.DELETE(
      req("/api/account/sessions/s2", {}, "https://evil.com"),
      ctx("s2"),
    );
    expect(response.status).toBe(403);
  });

  it("won't revoke this session", async () => {
    expect((await session.DELETE(req("/api/account/sessions/s1"), ctx("s1"))).status).toBe(400);
    expect(revokeSession).not.toHaveBeenCalled();
  });

  it("revokes one of theirs, 404 otherwise", async () => {
    expect((await session.DELETE(req("/api/account/sessions/s2"), ctx("s2"))).status).toBe(204);
    expect(revokeSession).toHaveBeenCalledWith("u1", "s2");
    revokeSession.mockResolvedValue(false);
    expect((await session.DELETE(req("/api/account/sessions/x"), ctx("x"))).status).toBe(404);
  });
});
