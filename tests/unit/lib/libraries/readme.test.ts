/**
 * @file tests/unit/lib/libraries/readme.test.ts
 * @desc fetchReadme: the raw README from GitHub, prepared (banner stripped, links rewritten),
 *       cached for a day; null on a non-2xx or a thrown fetch.
 * @author David @dvhsh (https://dvh.sh)
 * @created Fri Oct 2, 2026
 * @modified Fri Oct 2, 2026
 */

import { afterEach, describe, expect, it, vi } from "vitest";
import { LIBRARIES } from "@/constants/libraries";
import { fetchReadme } from "@/lib/libraries/readme";

const pool = LIBRARIES.find((lib) => lib.name === "pool") as (typeof LIBRARIES)[number];

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchReadme", () => {
  it("fetches the raw README and prepares it", async () => {
    const fetchMock = vi.fn(
      async () => new Response('<p align="center">b</p>\n\n# pool\n\n[k](docs/pack-key.md)'),
    );
    vi.stubGlobal("fetch", fetchMock);
    await expect(fetchReadme(pool)).resolves.toBe(
      "[k](https://github.com/haruhimemoe/pool/blob/main/docs/pack-key.md)",
    );
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://raw.githubusercontent.com/haruhimemoe/pool/main/README.md");
    expect(init.next).toEqual({ revalidate: 86400 });
  });

  it.each([
    ["a 404", () => Promise.resolve(new Response("Not Found", { status: 404 }))],
    ["a thrown fetch", () => Promise.reject(new Error("offline"))],
  ])("is null on %s", async (_name, impl) => {
    vi.stubGlobal("fetch", vi.fn(impl));
    await expect(fetchReadme(pool)).resolves.toBeNull();
  });
});
