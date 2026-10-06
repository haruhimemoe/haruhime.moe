/**
 * @file src/constants/legal-site.ts
 * @desc The LegalSite config the next-kit legal blocks (LegalContact, DataWeKeep, Processors,
 *       YourRights, DmcaNotice, NoWarranty, Changes) and legalEntries render from. haruhime.moe
 *       has no accounts, sets no cookies and runs no analytics: every page is static, served by
 *       Vercel, which keeps standard request logs. There's nothing for a visitor to post or
 *       upload, so `hosting` is omitted.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Oct 5, 2026
 * @modified Mon Oct 5, 2026
 */

import type { LegalSite } from "@haruhimemoe/next-kit/legal";
import { SITE } from "@/constants/site";

/** This site's facts for the five legal pages (/legal/terms, privacy, your-privacy-rights, copyright, disclaimers). */
export const LEGAL_SITE: LegalSite = {
  siteName: SITE.name,
  operator: "David (https://dvh.sh)",
  contactEmail: SITE.contactEmail,
  effectiveDate: "2026-10-05",
  stores: [
    {
      what: "Nothing tied to you",
      why: "No accounts, cookies or analytics; every page is static.",
    },
    {
      what: "Cached library stats",
      why: "npm and GitHub download counts, stars and releases, fetched by our server about once a day and cached; your browser never contacts them.",
    },
  ],
  processors: [
    {
      name: "Vercel",
      purpose: "hosts the site and keeps standard request logs for security and operations.",
      link: "https://vercel.com/legal/privacy-policy",
    },
  ],
  cookies: [],
};
