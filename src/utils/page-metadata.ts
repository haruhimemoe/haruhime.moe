/**
 * @file src/utils/page-metadata.ts
 * @desc Builds a page's Next metadata (title, description, canonical and Open Graph URL) from its
 *       PAGES entry, so the page, the sitemap, /llms.txt and the footer share one copy of its title
 *       and description.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Sep 28, 2026
 * @modified Mon Sep 28, 2026
 */

import type { Metadata } from "next";
import { PAGES, type PagePath } from "@/constants/site";

/**
 * @function pageMetadata
 * @param path {PagePath} the page's path, a key of PAGES
 * @returns {Metadata} the page's title and description from PAGES, with its path as the canonical
 *   and Open Graph URL
 */
export const pageMetadata = (path: PagePath): Metadata => ({
  title: PAGES[path].title,
  description: PAGES[path].description,
  alternates: { canonical: path },
  openGraph: { url: path },
});
