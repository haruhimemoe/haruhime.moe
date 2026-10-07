/**
 * @file tests/unit/lib/account-data.test.ts
 * @desc Account export and delete: export reads only the caller's identity with a projection
 *       that leaves tokens and sessions out; delete removes inbox and identity only after every
 *       app succeeded.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const fanOut = vi.fn();
const findOne = vi.fn();
const deleteIdentity = vi.fn();
const deleteFor = vi.fn();
vi.mock("@haruhimemoe/next-kit/account", async (orig) => ({
  ...(await orig<object>()),
  fanOut: (o: unknown) => fanOut(o),
}));
vi.mock("@/lib/db", () => ({
  connectDb: async () => {},
  getIdentityDb: () => ({ collection: () => ({ findOne }) }),
}));
vi.mock("@/lib/inbox", () => ({
  inboxStore: { deleteFor: (u: string, o: number) => deleteFor(u, o) },
}));
vi.mock("@/lib/sessions", () => ({ deleteIdentity: (id: string) => deleteIdentity(id) }));

const { exportAccount, deleteAccount } = await import("@/lib/account-data");
const USER = { id: "0123456789abcdef01234567", osuId: 7 };

beforeEach(() => {
  fanOut.mockReset();
  findOne.mockReset().mockResolvedValue({ name: "haruhime" });
  deleteIdentity.mockReset();
  deleteFor.mockReset();
});

describe("exportAccount", () => {
  it("projects the caller's identity without secrets and bundles each app", async () => {
    fanOut.mockResolvedValue({
      ok: true,
      results: [{ id: "packs", ok: true, status: 200, data: [1] }],
    });
    const bundle = await exportAccount(USER.id);
    const [filter, { projection }] = findOne.mock.calls[0] as [
      { _id: unknown },
      { projection: object },
    ];
    expect(String(filter._id)).toBe(USER.id);
    for (const key of Object.keys(projection)) {
      expect(key).not.toMatch(/token|secret|session|password/i);
    }
    expect(fanOut).toHaveBeenCalledWith(expect.objectContaining({ op: "export", userId: USER.id }));
    expect(bundle.apps.packs).toEqual([1]);
  });
});

describe("deleteAccount", () => {
  it("touches nothing in identity when an app fails", async () => {
    fanOut.mockResolvedValue({ ok: false, results: [{ id: "bb", ok: false, status: 500 }] });
    expect((await deleteAccount(USER)).ok).toBe(false);
    expect(deleteFor).not.toHaveBeenCalled();
    expect(deleteIdentity).not.toHaveBeenCalled();
  });

  it("deletes inbox and identity once every app succeeded", async () => {
    fanOut.mockResolvedValue({ ok: true, results: [] });
    expect((await deleteAccount(USER)).ok).toBe(true);
    expect(fanOut).toHaveBeenCalledWith(expect.objectContaining({ op: "delete", userId: USER.id }));
    expect(deleteFor).toHaveBeenCalledWith(USER.id, 7);
    expect(deleteIdentity).toHaveBeenCalledWith(USER.id);
  });
});
