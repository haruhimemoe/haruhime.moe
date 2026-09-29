/**
 * @file src/app/sitemap.ts
 * @desc sitemap.xml: every page in PAGES, each with its lastUpdated as lastmod. Static.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Mon Sep 28, 2026
 */

import { sitemapEntries } from "@haruhimemoe/next-kit/seo";
import type { MetadataRoute } from "next";
import { SEO_SITE } from "@/constants/seo";
import { PAGE_PATHS, PAGES } from "@/constants/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapEntries(SEO_SITE, [
    PAGE_PATHS.map((path) => ({ path, lastModified: PAGES[path].lastUpdated })),
  ]);
}
