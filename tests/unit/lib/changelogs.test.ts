/**
 * @file tests/unit/lib/changelogs.test.ts
 * @desc fetchChangelog reads the raw CHANGELOG.md with our User-Agent and a day's cache, points
 *       relative links at GitHub and parses it; a 404 or a thrown fetch is a failure, not a throw.
 *       fetchAllChangelogs keeps the input order and never rejects.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Sun Oct 4, 2026
 */

import { afterEach, describe, expect, it, vi } from "vitest";
import { CHANGELOG_SOURCES, findChangelogSource } from "@/constants/changelogs";
import { fetchAllChangelogs, fetchChangelog } from "@/lib/changelogs";

const ui = findChangelogSource("ui") as NonNullable<ReturnType<typeof findChangelogSource>>;
const BODY = "## [Unreleased]\n\n## [0.1.0] - 2026-09-23\n\n### Added\n\n- see [docs](docs/a.md)\n";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchChangelog", () => {
  it("fetches the raw file once a day with our User-Agent, and parses it", async () => {
    const fetchMock = vi.fn(async () => new Response(BODY));
    vi.stubGlobal("fetch", fetchMock);
    const result = await fetchChangelog(ui);
    expect(result).toEqual({
      source: ui,
      changelog: {
        unreleased: [],
        releases: [
          {
            version: "0.1.0",
            date: "2026-09-23",
            sections: [
              {
                name: "Added",
                items: ["see [docs](https://github.com/haruhimemoe/ui/blob/main/docs/a.md)"],
              },
            ],
          },
        ],
        references: [],
      },
    });
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://raw.githubusercontent.com/haruhimemoe/ui/main/CHANGELOG.md");
    expect(init.next).toEqual({ revalidate: 86400 });
    expect(new Headers(init.headers).get("user-agent")).toBe(
      "haruhime.moe (https://www.haruhime.moe)",
    );
  });

  it.each([
    ["a 404", () => Promise.resolve(new Response("Not Found", { status: 404 }))],
    ["a thrown fetch", () => Promise.reject(new Error("offline"))],
  ])("marks %s as failed", async (_name, impl) => {
    vi.stubGlobal("fetch", vi.fn(impl));
    await expect(fetchChangelog(ui)).resolves.toEqual({ source: ui, error: true });
  });
});

describe("fetchAllChangelogs", () => {
  it("fetches every source in order and survives some failing", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) =>
        url.includes("/pool/") ? new Response("", { status: 500 }) : new Response(BODY),
      ),
    );
    const results = await fetchAllChangelogs();
    expect(results.map((r) => r.source)).toEqual(CHANGELOG_SOURCES);
    expect(results.filter((r) => "error" in r).map((r) => r.source.slug)).toEqual(["pool"]);
  });

  it("fetches only the sources it's given", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(BODY)),
    );
    const results = await fetchAllChangelogs([ui]);
    expect(results).toHaveLength(1);
  });
});
