/**
 * @file src/constants/content.ts
 * @desc The content registry: every legal page (content/legal/<slug>.mdx), its title, search
 *       title, description and last update. The pages, their .md mirrors, the section nav, the
 *       footer's Legal column, the sitemap and both llms files read it. haruhime.moe has no docs
 *       (no API) and no guides. The five entries come from next-kit's legalEntries, with this
 *       site's own titles and descriptions as overrides; bump an entry's lastUpdated in the same
 *       commit as its text.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Tue Oct 6, 2026
 */

import { defineContent } from "@haruhimemoe/next-kit/docs";
import { legalEntries } from "@haruhimemoe/next-kit/legal";
import { LEGAL_SITE } from "@/constants/legal-site";

/** Every legal page, validated by next-kit's defineContent, in LEGAL_SLUGS order. */
export const CONTENT = defineContent({
  legal: legalEntries(LEGAL_SITE, {
    terms: {
      title: "Terms",
      description:
        "The terms for haruhime.moe itself: the site and the haruhime account, the MIT-licensed libraries, each tool's own terms, no warranty, and how to reach haruhime.",
      lastUpdated: "2026-10-07",
    },
    privacy: {
      title: "Privacy",
      description:
        "What haruhime.moe keeps: your haruhime account (your osu! profile and sign-in sessions) once you sign in, and Vercel's request logs. No analytics, nothing sold.",
      lastUpdated: "2026-10-07",
    },
    "your-privacy-rights": {
      title: "Your Privacy Rights",
      description:
        "Your rights under the GDPR and the CCPA: access, correct, delete and export your data, object to its use, and opt out, for your haruhime account and each tool.",
      lastUpdated: "2026-10-06",
    },
    copyright: {
      title: "Copyright",
      description:
        "How to report a copyright or DMCA concern about haruhime.moe or its tools: the takedown and counter notice steps, and that we host no beatmaps ourselves.",
      lastUpdated: "2026-10-05",
    },
    disclaimers: {
      title: "Disclaimers",
      description:
        "haruhime.moe and its osu! tools aren't affiliated with ppy. They use the osu! API and the hinai mirror under their terms, host no beatmaps, and come as is.",
      lastUpdated: "2026-09-23",
    },
  }),
});

/** Each legal page's search title, before " · haruhime.moe" (the keywords, under 60 in all). */
export const LEGAL_SEO_TITLES: Readonly<Record<string, string>> = {
  terms: "Terms of use for haruhime.moe",
  privacy: "Privacy policy for haruhime.moe",
  "your-privacy-rights": "Your privacy rights: GDPR & CCPA",
  copyright: "Copyright and DMCA notices",
  disclaimers: "Disclaimers: no ppy affiliation, as is",
};
