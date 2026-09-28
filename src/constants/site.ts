/**
 * @file src/constants/site.ts
 * @desc Site identity (SITE: name, address, description, contact, GitHub and Discord links, the
 *       ppy trademark notice), the Evergreen Cup banner's copy (EVERGREEN_CUP), and every page's
 *       title and description (PAGES), which page metadata, the sitemap, /llms.txt and the footer
 *       read.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Mon Sep 28, 2026
 */

/** Who and where the site is. Shared by metadata, JSON-LD, the footer and the contact page. */
export const SITE = {
  name: "haruhime.moe",
  person: "haruhime",
  url: "https://www.haruhime.moe",
  description:
    "haruhime's osu! tools for players, mappers and tournament hosts: packs, pools, bb and sheets.",
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
export type FooterColumnTitle = "haruhime.moe" | "Legal";

/** One page's copy, read by its metadata, the sitemap, /llms.txt and the footer. */
export interface PageInfo {
  /** The metadata title, the /llms.txt link text and the footer label. */
  readonly title: string;
  /** The meta description, and the page's line in /llms.txt. */
  readonly description: string;
  /** The footer column that links the page; the home page has none. */
  readonly footer?: FooterColumnTitle;
}

/**
 * Every page, in sitemap, /llms.txt and footer order. A new page gets an entry here; the sitemap,
 * /llms.txt and the footer pick it up, and its metadata comes from pageMetadata(path).
 */
export const PAGES = {
  "/": {
    title: "Home",
    description: "The tools, the Evergreen Cup banner, and a short hello.",
  },
  "/thanks": {
    title: "Thanks",
    description: "The people and projects the haruhime.moe tools are built on.",
    footer: "haruhime.moe",
  },
  "/brand": {
    title: "Brand",
    description:
      "The haruhime.moe name, logos, colors and type, the packs, pools and sheets icons, and every repo's README banner.",
    footer: "haruhime.moe",
  },
  "/ui": {
    title: "UI",
    description:
      "Every @haruhimemoe/ui component (the shared React kit) in its states: buttons, cards, forms, filters, tables, osu! pieces and the site shell.",
    footer: "haruhime.moe",
  },
  "/contact": {
    title: "Contact",
    description: "How to reach haruhime: email, Discord, GitHub, and security reports.",
    footer: "haruhime.moe",
  },
  "/disclaimer": {
    title: "Disclaimer",
    description:
      "No ppy affiliation, the third-party terms the tools follow, and the as-is notice.",
    footer: "Legal",
  },
} as const satisfies Record<`/${string}`, PageInfo>;

/** A page's path, a key of PAGES. */
export type PagePath = keyof typeof PAGES;

/** Every page's path, in PAGES order. */
export const PAGE_PATHS = Object.keys(PAGES) as PagePath[];
