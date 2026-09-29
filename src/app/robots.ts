/**
 * @file src/app/robots.ts
 * @desc robots.txt: everything is crawlable, search engines and AI assistants alike (next-kit
 *       robots with aiBots "allow", so every AI bot also gets its own explicit group). Static.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Mon Sep 28, 2026
 */

import { robots } from "@haruhimemoe/next-kit/seo";
import type { MetadataRoute } from "next";
import { SEO_SITE } from "@/constants/seo";

export default function robotsTxt(): MetadataRoute.Robots {
  return robots(SEO_SITE, { aiBots: "allow" });
}
