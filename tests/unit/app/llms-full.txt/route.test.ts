/**
 * @file tests/unit/app/llms-full.txt/route.test.ts
 * @desc GET /llms-full.txt: static, rebuilt daily, and carries the changelogs it fetched.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Sun Oct 4, 2026
 */

import { describe, expect, it, vi } from "vitest";
import { dynamic, GET, revalidate } from "@/app/llms-full.txt/route";
import { findChangelogSource } from "@/constants/changelogs";

vi.mock("@/lib/changelogs", () => ({
  fetchAllChangelogs: vi.fn(async () => [
    {
      source: findChangelogSource("bb"),
      changelog: {
        unreleased: [],
        releases: [{ version: "0.1.0", date: "2026-10-04", sections: [] }],
        references: [],
      },
    },
  ]),
}));

describe("GET /llms-full.txt", () => {
  it("is static, rebuilt daily, and includes the fetched changelogs", async () => {
    expect(dynamic).toBe("force-static");
    expect(revalidate).toBe(86400);
    const text = await (await GET()).text();
    expect(text).toContain("# bb changelog");
  });
});
