/**
 * @file src/constants/site.ts
 * @desc Site identity (SITE: name, address, description, contact, GitHub and Discord links, the
 *       ppy trademark notice), the Evergreen Cup banner's copy (EVERGREEN_CUP), and every page's
 *       label, search title, description and last-updated day (PAGES), which page metadata, the
 *       sitemap, /llms.txt and the footer read.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Fri Oct 2, 2026
 */

import { DISCLAIMER_UPDATED, PRIVACY_UPDATED, TERMS_UPDATED } from "@/constants/legal";

/** Who and where the site is. Shared by metadata, JSON-LD, the footer and the contact page. */
export const SITE = {
  name: "haruhime.moe",
  person: "haruhime",
  url: "https://www.haruhime.moe",
  description:
    "haruhime's free osu! tools for players, mappers and tournament hosts: packs downloads a mappool as one zip or torrent, pools builds mappools, bb edits BBCode.",
  contactEmail: "contact@haruhime.moe",
  githubOrg: "https://github.com/haruhimemoe",
  discordUrl: "https://discord.gg/bKy9kjMV4y",
  trademarkNotice:
    "Not affiliated with or endorsed by ppy Pty Ltd. osu! is a trademark of ppy Pty Ltd.",
} as const;

/** Name, link and line for the Evergreen Cup banner (EgcBanner) on the homepage. */
export const EVERGREEN_CUP = {
  name: "Evergreen Cup",
  url: "https://evergreencup.org",
  line: "a Pacific Northwest osu! LAN tournament.",
} as const;

/** A footer column that can list a page. */
export type FooterColumnTitle = "Libraries" | "haruhime.moe" | "Legal";

/** One page's copy, read by its metadata, the sitemap, /llms.txt and the footer. */
export interface PageInfo {
  /** The /llms.txt link text and the footer label: one short word. */
  readonly title: string;
  /**
   * The search title, before " · haruhime.moe": the page's keywords. Every page but home needs
   * one; home's is SEO_SITE.title.
   */
  readonly seoTitle?: string;
  /** The meta description (about 150 characters), and the page's line in /llms.txt. */
  readonly description: string;
  /** The day the page's visible content last changed (YYYY-MM-DD), the sitemap's lastmod. */
  readonly lastUpdated: string;
  /** The footer column that links the page; the home page has none. */
  readonly footer?: FooterColumnTitle;
}

/**
 * Every page, in sitemap, /llms.txt and footer order. A new page gets an entry here; the sitemap,
 * /llms.txt and the footer pick it up, and its metadata comes from pageMetadata(path). Bump a
 * page's lastUpdated when its visible content changes, never otherwise.
 */
export const PAGES = {
  "/": {
    title: "Home",
    description: "The tools, the Evergreen Cup banner, and a short hello.",
    lastUpdated: "2026-10-02",
  },
  "/thanks": {
    title: "Thanks",
    seoTitle: "Thanks and credits for haruhime's osu! tools",
    description:
      "The people and projects haruhime's osu! tools are built on: Evergreen Cup staff, the osu!cafe crew, omc-api, otdb, BoBERT, the hinai mirror, and ppy.",
    lastUpdated: "2026-09-28",
    footer: "haruhime.moe",
  },
  "/brand": {
    title: "Brand",
    seoTitle: "Brand kit: logos, colors and README banners",
    description:
      "The haruhime.moe brand kit: name, logos, the Nunito type, the color palette, the packs, pools, bb and sheets icons, and every repo's README banner to download.",
    lastUpdated: "2026-09-28",
    footer: "haruhime.moe",
  },
  "/libraries": {
    title: "Libraries",
    seoTitle: "Libraries: the @haruhimemoe packages",
    description:
      "The eight @haruhimemoe npm packages the osu! tools are built from, each with its version, downloads, stars and a docs page: ui, next-kit, osu, pool and more.",
    lastUpdated: "2026-10-02",
    footer: "Libraries",
  },
  "/ui": {
    title: "UI",
    seoTitle: "@haruhimemoe/ui: React kit for osu! tools",
    description:
      "Every @haruhimemoe/ui component, the React kit behind haruhime's osu! tools, live in its states: buttons, cards, forms, filters, tables and osu! pieces.",
    lastUpdated: "2026-09-28",
    footer: "Libraries",
  },
  "/contact": {
    title: "Contact",
    seoTitle: "Contact haruhime: email, Discord, GitHub",
    description:
      "How to reach haruhime about the osu! tools: email for anything, Discord for questions and feedback, GitHub for issues, and where security reports go.",
    lastUpdated: "2026-09-28",
    footer: "haruhime.moe",
  },
  "/disclaimer": {
    title: "Disclaimer",
    seoTitle: "Disclaimer: no ppy affiliation, as-is notice",
    description:
      "haruhime.moe and its osu! tools aren't affiliated with ppy. They use the osu! API and the hinai mirror under their terms, host no beatmaps, and come as is.",
    lastUpdated: DISCLAIMER_UPDATED,
    footer: "Legal",
  },
  "/terms": {
    title: "Terms",
    seoTitle: "Terms of use for haruhime.moe",
    description:
      "The terms for using haruhime.moe itself: what the site is, the MIT-licensed libraries, that each tool has its own terms, no warranty, and how to reach haruhime.",
    lastUpdated: TERMS_UPDATED,
    footer: "Legal",
  },
  "/privacy": {
    title: "Privacy",
    seoTitle: "Privacy policy for haruhime.moe",
    description:
      "What this site collects: nothing of its own. No accounts, cookies or analytics, only Vercel's request logs. Stats come from npm and GitHub server to server.",
    lastUpdated: PRIVACY_UPDATED,
    footer: "Legal",
  },
} as const satisfies Record<`/${string}`, PageInfo>;

/** A page's path, a key of PAGES. */
export type PagePath = keyof typeof PAGES;

/** Every page's path, in PAGES order. */
export const PAGE_PATHS = Object.keys(PAGES) as PagePath[];
