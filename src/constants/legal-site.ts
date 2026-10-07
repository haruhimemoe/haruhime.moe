/**
 * @file src/constants/legal-site.ts
 * @desc The LegalSite config the next-kit legal blocks (LegalContact, DataWeKeep, Processors,
 *       YourRights, DmcaNotice, NoWarranty, Changes) and legalEntries render from. haruhime.moe
 *       holds the haruhime account (osu! sign-in for every tool): the osu! profile, the osu! link
 *       and sessions, in MongoDB Atlas. No analytics. Pages are served by Vercel, which keeps
 *       standard request logs. There's nothing for a visitor to post or upload, so `hosting` is
 *       omitted. Kept in step with content/legal/privacy.mdx.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Oct 5, 2026
 * @modified Tue Oct 6, 2026
 */

import type { LegalSite } from "@haruhimemoe/next-kit/legal";
import { SITE } from "@/constants/site";

/** This site's facts for the five legal pages (/legal/terms, privacy, your-privacy-rights, copyright, disclaimers). */
export const LEGAL_SITE: LegalSite = {
  siteName: SITE.name,
  operator: "haruhime",
  contactEmail: SITE.contactEmail,
  effectiveDate: "2026-10-06",
  stores: [
    {
      what: "Your haruhime account, if you sign in",
      why: "Your osu! ID, username, avatar and country from osu!, kept so one sign-in works on packs, pools and bb. No osu! password or osu! tokens are kept.",
    },
    {
      what: "Your sign-in sessions",
      why: "Each signed-in device's session, with when it signed in, its browser's user agent and IP address, so you can see and sign out your devices on /account. A session ends 30 days after you last use it.",
    },
    {
      what: "Cached library stats",
      why: "Versions, download counts, stars, releases and READMEs for the Libraries pages, fetched from npm and GitHub by our server about once a day; your browser never contacts npm or GitHub for them, so neither sees your visit.",
    },
  ],
  processors: [
    {
      name: "Vercel",
      purpose: "hosts the site and keeps standard request logs for security and operations.",
      link: "https://vercel.com/legal/privacy-policy",
    },
    {
      name: "MongoDB Atlas",
      purpose: "stores the haruhime accounts and their sessions.",
      link: "https://www.mongodb.com/legal/privacy/privacy-policy",
    },
    {
      name: "osu! (ppy Pty Ltd)",
      purpose: "confirms who you are when you sign in with osu!.",
      link: "https://osu.ppy.sh/legal/Privacy",
    },
  ],
  cookies: [
    "Only once you sign in. A short-lived cookie while sign-in runs.",
    "A session cookie lasting until 30 days after you last use haruhime.moe or one of its tools, shared by every *.haruhime.moe tool.",
    "haruhime-signed-in, which pages can read. It only says this browser may be signed in; pages ask who you are only when it's there.",
  ],
};
