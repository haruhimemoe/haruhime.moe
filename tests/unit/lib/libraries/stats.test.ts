/**
 * @file tests/unit/lib/libraries/stats.test.ts
 * @desc fetchLibraryStats: the four lookups run together and each field is null on its own
 *       failure, so one dead API never blanks the others.
 * @author David @dvhsh (https://dvh.sh)
 * @created Fri Oct 2, 2026
 * @modified Fri Oct 2, 2026
 */

import { afterEach, describe, expect, it, vi } from "vitest";
import { LIBRARIES } from "@/constants/libraries";
import { fetchLibraryStats } from "@/lib/libraries/stats";

const ui = LIBRARIES[0] as (typeof LIBRARIES)[number];

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchLibraryStats", () => {
  it("combines npm and GitHub into one record", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => {
        if (url.includes("registry.npmjs.org")) return json({ version: "0.6.0", license: "MIT" });
        if (url.includes("api.npmjs.org")) return json({ downloads: 321 });
        if (url.endsWith("/releases/latest"))
          return json({ tag_name: "v0.6.0", published_at: "2026-09-28T20:35:00Z" });
        return json({ stargazers_count: 7 });
      }),
    );
    await expect(fetchLibraryStats(ui)).resolves.toEqual({
      version: "0.6.0",
      license: "MIT",
      downloads: 321,
      stars: 7,
      release: { tag: "v0.6.0", publishedAt: "2026-09-28T20:35:00Z" },
    });
  });

  it("keeps npm's numbers when GitHub is rate limited", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => {
        if (url.includes("registry.npmjs.org")) return json({ version: "0.6.0", license: "MIT" });
        if (url.includes("api.npmjs.org")) return json({ downloads: 321 });
        return json({ message: "API rate limit exceeded" }, 403);
      }),
    );
    await expect(fetchLibraryStats(ui)).resolves.toEqual({
      version: "0.6.0",
      license: "MIT",
      downloads: 321,
      stars: null,
      release: null,
    });
  });

  it("is all null when every fetch throws", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("offline"))),
    );
    await expect(fetchLibraryStats(ui)).resolves.toEqual({
      version: null,
      license: null,
      downloads: null,
      stars: null,
      release: null,
    });
  });
});
