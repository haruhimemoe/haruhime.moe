/**
 * @file src/constants/content.ts
 * @desc The content registry: every legal page (content/legal/<slug>.mdx), its title, search
 *       title, description and last update. The pages, their .md mirrors, the section nav, the
 *       footer's Legal column, the sitemap and both llms files read it. haruhime.moe has no docs
 *       (no API) and no guides. Bump an entry's lastUpdated in the same commit as its text.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Sun Oct 4, 2026
 */

import { defineContent } from "@haruhimemoe/next-kit/docs";

/** Every legal page, validated by next-kit's defineContent, in footer order. */
export const CONTENT = defineContent({
  legal: [
    {
      slug: "disclaimer",
      title: "Disclaimer",
      description:
        "haruhime.moe and its osu! tools aren't affiliated with ppy. They use the osu! API and the hinai mirror under their terms, host no beatmaps, and come as is.",
      lastUpdated: "2026-09-23",
    },
    {
      slug: "terms",
      title: "Terms",
      description:
        "The terms for using haruhime.moe itself: what the site is, the MIT-licensed libraries, that each tool has its own terms, no warranty, and how to reach haruhime.",
      lastUpdated: "2026-10-02",
    },
    {
      slug: "privacy",
      title: "Privacy",
      description:
        "What this site collects: nothing of its own. No accounts, cookies or analytics, only Vercel's request logs. Stats come from npm and GitHub server to server.",
      lastUpdated: "2026-10-02",
    },
  ],
});

/** Each legal page's search title, before " · haruhime.moe" (the keywords, under 60 in all). */
export const LEGAL_SEO_TITLES: Readonly<Record<string, string>> = {
  disclaimer: "Disclaimer: no ppy affiliation, as-is notice",
  terms: "Terms of use for haruhime.moe",
  privacy: "Privacy policy for haruhime.moe",
};
