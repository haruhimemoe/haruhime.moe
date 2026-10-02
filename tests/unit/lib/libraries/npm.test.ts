/**
 * @file tests/unit/lib/libraries/npm.test.ts
 * @desc npm fetchers: the latest version and license from the registry, last month's downloads
 *       from the downloads API; null on a non-2xx, a thrown fetch or a body that isn't the shape.
 * @author David @dvhsh (https://dvh.sh)
 * @created Fri Oct 2, 2026
 * @modified Fri Oct 2, 2026
 */

import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchNpmDownloads, fetchNpmLatest } from "@/lib/libraries/npm";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchNpmLatest", () => {
  it("reads version and license from the registry's latest dist-tag", async () => {
    const fetchMock = vi.fn(async () => json({ version: "0.6.0", license: "MIT" }));
    vi.stubGlobal("fetch", fetchMock);
    await expect(fetchNpmLatest("@haruhimemoe/ui")).resolves.toEqual({
      version: "0.6.0",
      license: "MIT",
    });
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://registry.npmjs.org/@haruhimemoe%2Fui/latest");
    expect(init.next).toEqual({ revalidate: 86400 });
  });

  it("gives a null license when the registry has none", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => json({ version: "0.1.0" })),
    );
    await expect(fetchNpmLatest("@haruhimemoe/x")).resolves.toEqual({
      version: "0.1.0",
      license: null,
    });
  });

  it.each([
    ["a 404", () => json({ error: "Not found" }, 404)],
    ["a thrown fetch", () => Promise.reject(new Error("offline"))],
    ["a body without a version", () => json({ license: "MIT" })],
    ["a body that isn't JSON", () => new Response("<html>", { status: 200 })],
  ])("is null on %s", async (_name, impl) => {
    vi.stubGlobal("fetch", vi.fn(impl));
    await expect(fetchNpmLatest("@haruhimemoe/ui")).resolves.toBeNull();
  });
});

describe("fetchNpmDownloads", () => {
  it("reads last month's download count", async () => {
    const fetchMock = vi.fn(async () => json({ downloads: 1234, package: "@haruhimemoe/ui" }));
    vi.stubGlobal("fetch", fetchMock);
    await expect(fetchNpmDownloads("@haruhimemoe/ui")).resolves.toBe(1234);
    const [url] = fetchMock.mock.calls[0] as unknown as [string];
    expect(url).toBe("https://api.npmjs.org/downloads/point/last-month/@haruhimemoe/ui");
  });

  it.each([
    ["a 404", () => json({ error: "package not found" }, 404)],
    ["a thrown fetch", () => Promise.reject(new Error("offline"))],
    ["a non-number count", () => json({ downloads: "many" })],
  ])("is null on %s", async (_name, impl) => {
    vi.stubGlobal("fetch", vi.fn(impl));
    await expect(fetchNpmDownloads("@haruhimemoe/ui")).resolves.toBeNull();
  });
});
