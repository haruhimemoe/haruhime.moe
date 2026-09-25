/**
 * @file src/constants/site.ts
 * @desc Site identity: name, address, description, contact, GitHub and Discord links and the ppy
 *       trademark notice.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Fri Sep 25, 2026
 */

/** Who and where the site is. Shared by metadata, JSON-LD, the footer and the contact page. */
export const SITE = {
  name: "haruhime.moe",
  person: "haruhime",
  url: "https://www.haruhime.moe",
  description: "haruhime's osu! tournament tools: packs, pools and sheets, built for hosts.",
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

/** Every page, for the sitemap. Add a path here when you add a page. */
export const PAGE_PATHS = ["/", "/thanks", "/brand", "/ui", "/contact", "/disclaimer"] as const;
