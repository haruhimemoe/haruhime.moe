/**
 * @file tests/unit/utils/page-metadata.test.ts
 * @desc pageMetadata: every page's title and description come from PAGES, with its path as the
 *       canonical and Open Graph URL.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Sep 28, 2026
 * @modified Mon Sep 28, 2026
 */

import { describe, expect, it } from "vitest";
import { PAGE_PATHS, PAGES } from "@/constants/site";
import { pageMetadata } from "@/utils/page-metadata";

describe("pageMetadata", () => {
  it.each(PAGE_PATHS)("builds %s from its PAGES entry", (path) => {
    expect(pageMetadata(path)).toEqual({
      title: PAGES[path].title,
      description: PAGES[path].description,
      alternates: { canonical: path },
      openGraph: { url: path },
    });
  });
});

describe("PAGES", () => {
  it("gives every page but home a footer column", () => {
    for (const path of PAGE_PATHS) {
      const footer = (PAGES[path] as { footer?: string }).footer;
      if (path === "/") expect(footer).toBeUndefined();
      else expect(footer).toMatch(/^(haruhime\.moe|Legal)$/);
    }
  });

  it("keeps every description one line, with no em dash", () => {
    for (const path of PAGE_PATHS) {
      expect(PAGES[path].description).not.toMatch(/[\n—]/);
    }
  });
});
