/**
 * @file src/utils/page-metadata.ts
 * @desc A page's Next metadata from its PAGES entry, through @haruhimemoe/next-kit/seo's
 *       pageMetadata: "keywords · haruhime.moe" title, description, canonical and og:url, and the
 *       full Open Graph block with the site image (a page's openGraph replaces the root's, so the
 *       image has to be set on every page).
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Sep 28, 2026
 * @modified Mon Sep 28, 2026
 */

import { pageMetadata as seoPageMetadata } from "@haruhimemoe/next-kit/seo";
import type { Metadata } from "next";
import { SEO_SITE } from "@/constants/seo";
import { PAGES, type PagePath } from "@/constants/site";

/**
 * @function pageMetadata
 * @param path {Exclude<PagePath, "/">} the page's path, a key of PAGES other than home (home uses
 *   homeMetadata)
 * @returns {Metadata} the page's metadata: its seoTitle and description from PAGES,
 *   its absolute URL as canonical and og:url, the site's Open Graph image
 */
export const pageMetadata = (path: Exclude<PagePath, "/">): Metadata =>
  seoPageMetadata(SEO_SITE, {
    path,
    title: PAGES[path].seoTitle,
    description: PAGES[path].description,
  });
