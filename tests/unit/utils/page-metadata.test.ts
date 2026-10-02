/**
 * @file tests/unit/utils/page-metadata.test.ts
 * @desc pageMetadata: every page's "keywords · haruhime.moe" title and description come from PAGES,
 *       its absolute URL is both canonical and og:url, and the site's Open Graph image and site
 *       name are never dropped. PAGES: footer columns, one-line ~150-character descriptions,
 *       unique titles, real lastUpdated dates.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Sep 28, 2026
 * @modified Fri Oct 2, 2026
 */

import { describe, expect, it } from "vitest";
import { PAGE_PATHS, PAGES, type PagePath } from "@/constants/site";
import { pageMetadata } from "@/utils/page-metadata";

const SUBPAGES = PAGE_PATHS.filter((path): path is Exclude<PagePath, "/"> => path !== "/");

describe("pageMetadata", () => {
  it.each(SUBPAGES)("builds %s from its PAGES entry", (path) => {
    const page = PAGES[path];
    const meta = pageMetadata(path);
    const url = `https://www.haruhime.moe${path}`;
    expect(meta.title).toEqual({ absolute: `${page.seoTitle} · haruhime.moe` });
    expect(meta.description).toBe(page.description);
    expect(meta.alternates?.canonical).toBe(url);
    expect(meta.openGraph).toMatchObject({
      url,
      siteName: "haruhime.moe",
      type: "website",
      images: [expect.objectContaining({ url: "/opengraph-image.png", width: 1200, height: 630 })],
    });
  });

  it("keeps every title within 60 characters and every title unique", () => {
    const titles = SUBPAGES.map(
      (path) => (pageMetadata(path).title as { absolute: string }).absolute,
    );
    for (const title of titles) expect(title.length).toBeLessThanOrEqual(60);
    expect(new Set(titles).size).toBe(titles.length);
  });
});

describe("PAGES", () => {
  it("gives every page but home a footer column", () => {
    for (const path of PAGE_PATHS) {
      const footer = (PAGES[path] as { footer?: string }).footer;
      if (path === "/") expect(footer).toBeUndefined();
      else expect(footer).toMatch(/^(Libraries|haruhime\.moe|Legal)$/);
    }
  });

  it("keeps every description one line, with no em dash", () => {
    for (const path of PAGE_PATHS) {
      expect(PAGES[path].description).not.toMatch(/[\n—]/);
    }
  });

  it("gives every page but home a 140-160 character description", () => {
    for (const path of SUBPAGES) {
      expect(PAGES[path].description.length).toBeGreaterThanOrEqual(140);
      expect(PAGES[path].description.length).toBeLessThanOrEqual(160);
    }
  });

  it("dates every page with a real YYYY-MM-DD day, on or after launch", () => {
    for (const path of PAGE_PATHS) {
      const { lastUpdated } = PAGES[path];
      expect(lastUpdated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(lastUpdated))).toBe(false);
      expect(lastUpdated >= "2026-09-23").toBe(true);
    }
  });
});
