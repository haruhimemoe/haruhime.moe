/**
 * @file src/app/sitemap.ts
 * @desc sitemap.xml: every page in PAGE_PATHS. Static.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

import type { MetadataRoute } from "next";
import { PAGE_PATHS, SITE } from "@/constants/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGE_PATHS.map((path) => ({ url: `${SITE.url}${path}` }));
}
