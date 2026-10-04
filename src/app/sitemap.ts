/**
 * @file src/app/sitemap.ts
 * @desc sitemap.xml: every page in PAGES, each with its lastUpdated as lastmod, then a docs page
 *       per library, the two changelog kind feeds and a page per changelog repo. Static.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Sun Oct 4, 2026
 */

import { sitemapEntries } from "@haruhimemoe/next-kit/seo";
import type { MetadataRoute } from "next";
import { CHANGELOG_SOURCES, changelogUrls, KIND_SEGMENTS } from "@/constants/changelogs";
import { LIBRARIES, libraryUrls } from "@/constants/libraries";
import { SEO_SITE } from "@/constants/seo";
import { PAGE_PATHS, PAGES } from "@/constants/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapEntries(SEO_SITE, [
    PAGE_PATHS.map((path) => ({ path, lastModified: PAGES[path].lastUpdated })),
    // A docs page renders its README from GitHub, so its change date isn't known here: no lastmod.
    LIBRARIES.map((lib) => ({ path: libraryUrls(lib).docs })),
    // The changelog filters and repo pages render files from GitHub too: no lastmod.
    Object.keys(KIND_SEGMENTS).map((kind) => ({ path: `/changelog/kind/${kind}` })),
    CHANGELOG_SOURCES.map((source) => ({ path: changelogUrls(source).page })),
  ]);
}
