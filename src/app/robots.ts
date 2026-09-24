/**
 * @file src/app/robots.ts
 * @desc robots.txt: everything is crawlable, search engines and AI assistants alike. Static.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

import type { MetadataRoute } from "next";
import { SITE } from "@/constants/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
