/**
 * @file tests/integration/app/api/account-preferences.test.ts
 * @desc GET/POST /api/account/preferences: 401 signed out (both methods), a valid zone and hour
 *       cycle round-trips, an unknown zone 400s, and a cross-site POST 403s, same refusals as
 *       every other hub write. The identity database and the session are faked (@/lib/db,
 *       @/lib/auth), since this app takes no new test dependency for a real MongoDB.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 11, 2026
 * @modified Sun Oct 11, 2026
 */

import { ObjectId } from "mongodb";
import { afterEach, describe, expect, it, vi } from "vitest";

type FakeUser = { id: string } | null;

const session = vi.hoisted(() => ({ user: null as FakeUser }));

const users = new Map<string, { _id: ObjectId; preferences?: string }>();

const fakeDb = {
  collection(name: string) {
    if (name !== "user") throw new Error(`unexpected collection: ${name}`);
    return {
      findOne: async (filter: { _id: ObjectId }) => users.get(filter._id.toHexString()) ?? null,
      updateOne: async (filter: { _id: ObjectId }, update: { $set: Record<string, unknown> }) => {
        const key = filter._id.toHexString();
        users.set(key, { ...(users.get(key) ?? { _id: filter._id }), ...update.$set });
      },
    };
  },
};

vi.mock("@/lib/db", () => ({ getIdentityDb: () => fakeDb }));
vi.mock("@/lib/auth", () => ({ getUserFromHeaders: async () => session.user }));

const { GET, POST } = await import("@/app/api/account/preferences/route");

const USER_ID = new ObjectId().toHexString();

const request = (method: string, body?: unknown, headers?: Record<string, string>) =>
  new Request("https://www.haruhime.moe/api/account/preferences", {
    method,
    headers: { "content-type": "application/json", ...headers },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

describe("/api/account/preferences", () => {
  afterEach(() => {
    session.user = null;
    users.clear();
  });

  it("401s GET when signed out", async () => {
    const res = await GET(request("GET"));
    expect(res.status).toBe(401);
  });

  it("round-trips a valid zone and hour cycle", async () => {
    session.user = { id: USER_ID };
    const posted = await POST(request("POST", { timezone: "Asia/Tokyo", hourCycle: "h12" }));
    expect(posted.status).toBe(200);
    expect(await posted.json()).toEqual({ timezone: "Asia/Tokyo", hourCycle: "h12" });

    const got = await GET(request("GET"));
    expect(await got.json()).toEqual({ timezone: "Asia/Tokyo", hourCycle: "h12" });
  });

  it("400s an unknown zone", async () => {
    session.user = { id: USER_ID };
    const res = await POST(request("POST", { timezone: "Nowhere/Fake", hourCycle: null }));
    expect(res.status).toBe(400);
  });

  it("401s POST when signed out", async () => {
    const res = await POST(request("POST", { timezone: "Asia/Tokyo" }));
    expect(res.status).toBe(401);
  });

  it("403s a cross-site POST, refused before the session check", async () => {
    session.user = null;
    const res = await POST(
      request("POST", { timezone: "Asia/Tokyo" }, { "sec-fetch-site": "cross-site" }),
    );
    expect(res.status).toBe(403);
  });

  it("every answer is no-store", async () => {
    session.user = { id: USER_ID };
    const res = await GET(request("GET"));
    expect(res.headers.get("cache-control")).toContain("no-store");
  });
});
