/**
 * @file tests/unit/lib/libraries/github.test.ts
 * @desc GitHub fetchers: stars from the repo, tag and date from the latest release; a repo with no
 *       release is null, not an error; null on a 403 rate limit, a thrown fetch or a wrong shape.
 * @author David @dvhsh (https://dvh.sh)
 * @created Fri Oct 2, 2026
 * @modified Fri Oct 2, 2026
 */

import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchGithubLatestRelease, fetchGithubRepo } from "@/lib/libraries/github";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchGithubRepo", () => {
  it("reads the star count, asking for the v3 JSON media type", async () => {
    const fetchMock = vi.fn(async () => json({ stargazers_count: 42, name: "ui" }));
    vi.stubGlobal("fetch", fetchMock);
    await expect(fetchGithubRepo("ui")).resolves.toEqual({ stars: 42 });
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.github.com/repos/haruhimemoe/ui");
    expect(new Headers(init.headers).get("accept")).toBe("application/vnd.github+json");
    expect(new Headers(init.headers).get("user-agent")).toContain("haruhime.moe");
    expect(init.next).toEqual({ revalidate: 86400 });
  });

  it.each([
    ["a 403 rate limit", () => json({ message: "API rate limit exceeded" }, 403)],
    ["a thrown fetch", () => Promise.reject(new Error("offline"))],
    ["a body without stargazers_count", () => json({ name: "ui" })],
  ])("is null on %s", async (_name, impl) => {
    vi.stubGlobal("fetch", vi.fn(impl));
    await expect(fetchGithubRepo("ui")).resolves.toBeNull();
  });
});

describe("fetchGithubLatestRelease", () => {
  it("reads the tag and publish date", async () => {
    const fetchMock = vi.fn(async () =>
      json({ tag_name: "v0.6.0", published_at: "2026-09-28T20:35:00Z" }),
    );
    vi.stubGlobal("fetch", fetchMock);
    await expect(fetchGithubLatestRelease("ui")).resolves.toEqual({
      tag: "v0.6.0",
      publishedAt: "2026-09-28T20:35:00Z",
    });
    const [url] = fetchMock.mock.calls[0] as unknown as [string];
    expect(url).toBe("https://api.github.com/repos/haruhimemoe/ui/releases/latest");
  });

  it.each([
    ["no release yet (404)", () => json({ message: "Not Found" }, 404)],
    ["a 403 rate limit", () => json({ message: "API rate limit exceeded" }, 403)],
    ["a thrown fetch", () => Promise.reject(new Error("offline"))],
    ["a body without a tag", () => json({ published_at: "2026-09-28T20:35:00Z" })],
  ])("is null on %s", async (_name, impl) => {
    vi.stubGlobal("fetch", vi.fn(impl));
    await expect(fetchGithubLatestRelease("ui")).resolves.toBeNull();
  });
});
