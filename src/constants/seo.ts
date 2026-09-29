/**
 * @file src/constants/seo.ts
 * @desc The site as @haruhimemoe/next-kit/seo sees it (SEO_SITE): the home title and description,
 *       the "· haruhime.moe" title suffix, the static Open Graph image, and HARUHIME_ORG, the
 *       organization every haruhime tool points at. Root metadata, page metadata, robots.txt, the
 *       sitemap and the JSON-LD all read it.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Sep 28, 2026
 * @modified Mon Sep 28, 2026
 */

import { HARUHIME_ORG, type Site } from "@haruhimemoe/next-kit/seo";
import { SITE } from "@/constants/site";

/**
 * The parent site for next-kit's metadata, robots, sitemap and JSON-LD helpers. No `parent`: this
 * is the parent. The OG image entry matches src/app/opengraph-image.png (1200x630) and its alt
 * text, so pages that set their own openGraph keep the image.
 */
export const SEO_SITE: Site = {
  name: SITE.name,
  url: SITE.url,
  title: "osu! tools for players, mappers and hosts",
  titleSuffix: SITE.name,
  description: SITE.description,
  ogImages: [
    {
      url: "/opengraph-image.png",
      width: 1200,
      height: 630,
      alt: "haruhime.moe: osu! tools for players, mappers and hosts",
      type: "image/png",
    },
  ],
  organization: HARUHIME_ORG,
};
