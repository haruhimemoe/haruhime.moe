/**
 * @file tests/unit/app/sitemap.test.ts
 * @desc sitemap.xml lists every page with its real lastUpdated, and robots.txt allows everything,
 *       names every AI bot in its own allow group, and points at the sitemap.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Sun Oct 4, 2026
 */

import { readdirSync } from "node:fs";
import path from "node:path";
import { AI_BOTS } from "@haruhimemoe/next-kit/seo";
import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { CHANGELOG_SOURCES } from "@/constants/changelogs";
import { LIBRARIES } from "@/constants/libraries";
import { PAGE_PATHS, PAGES } from "@/constants/site";

/** Every route path under src/app that has its own page.tsx, derived straight from the filesystem. */
const routePathsOnDisk = (): string[] => {
  const appDir = path.join(process.cwd(), "src/app");
  return (
    readdirSync(appDir, { recursive: true })
      .filter((entry) => entry.toString().endsWith("page.tsx"))
      // A dynamic segment ([name]) is listed from its own data, not from PAGES.
      .filter((entry) => !entry.toString().includes("["))
      .map((entry) => {
        const dir = path.posix.dirname(entry.toString().split(path.sep).join("/"));
        return dir === "." ? "/" : `/${dir}`;
      })
      .sort()
  );
};

describe("sitemap", () => {
  it("lists every page on the live domain", () => {
    expect(sitemap().map((entry) => entry.url)).toEqual([
      "https://www.haruhime.moe/",
      "https://www.haruhime.moe/thanks",
      "https://www.haruhime.moe/libraries",
      "https://www.haruhime.moe/changelog",
      "https://www.haruhime.moe/brand",
      "https://www.haruhime.moe/ui",
      "https://www.haruhime.moe/contact",
      "https://www.haruhime.moe/disclaimer",
      "https://www.haruhime.moe/terms",
      "https://www.haruhime.moe/privacy",
      ...LIBRARIES.map((lib) => `https://www.haruhime.moe/libraries/${lib.name}`),
      "https://www.haruhime.moe/changelog/kind/apps",
      "https://www.haruhime.moe/changelog/kind/packages",
      ...CHANGELOG_SOURCES.map((s) => `https://www.haruhime.moe/changelog/${s.slug}`),
    ]);
  });

  it("gives the changelog filter and repo pages no lastModified: their files live on GitHub", () => {
    const pages = sitemap().filter((entry) => /\/changelog\/.+/.test(entry.url));
    expect(pages).toHaveLength(2 + CHANGELOG_SOURCES.length);
    for (const entry of pages) expect(entry.lastModified).toBeUndefined();
  });

  it("gives a library docs page no lastModified: the README's date isn't known at build", () => {
    const docs = sitemap().filter((entry) => entry.url.includes("/libraries/"));
    expect(docs).toHaveLength(LIBRARIES.length);
    for (const entry of docs) expect(entry.lastModified).toBeUndefined();
  });

  it("dates every page with its PAGES lastUpdated, never a build time", () => {
    const pages = sitemap().slice(0, PAGE_PATHS.length);
    for (const [i, entry] of pages.entries()) {
      const path = PAGE_PATHS[i] as (typeof PAGE_PATHS)[number];
      expect(entry.lastModified).toBe(new Date(PAGES[path].lastUpdated).toISOString());
    }
  });

  it("matches every page.tsx under src/app, so a new page can't miss the sitemap", () => {
    expect([...PAGE_PATHS].sort()).toEqual(routePathsOnDisk());
  });
});

describe("robots", () => {
  const txt = robots();
  const rules = [txt.rules].flat();

  it("allows everything for every crawler and names the sitemap and host", () => {
    expect(rules[0]).toEqual({ userAgent: "*", allow: ["/"] });
    expect(txt.sitemap).toBe("https://www.haruhime.moe/sitemap.xml");
    expect(txt.host).toBe("https://www.haruhime.moe");
    for (const rule of rules) expect(rule.disallow ?? []).toEqual([]);
  });

  it("names every AI bot in an allow group, so the stance is explicit", () => {
    const named = rules.flatMap((rule) => [rule.userAgent ?? []].flat());
    for (const bot of AI_BOTS) expect(named).toContain(bot.userAgent);
  });
});
