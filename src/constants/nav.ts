/**
 * @file src/constants/nav.ts
 * @desc The header and footer links, as data for @haruhimemoe/ui's SiteHeader and SiteFooter.
 *       Tools that haven't launched show as plain text marked "soon" and link nowhere. The page
 *       haruhime.moe column comes from each page's footer column in PAGES, the Legal column from
 *       the content registry's legal pages (at /legal/<slug>).
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Sun Oct 4, 2026
 */

import { contentPath } from "@haruhimemoe/next-kit/docs";
import type { SiteFooterColumn, SiteLinkItem } from "@haruhimemoe/ui";
import { CONTENT } from "@/constants/content";
import { type FooterColumnTitle, PAGE_PATHS, PAGES } from "@/constants/site";
import { TOOLS, type Tool } from "@/constants/tools";

/**
 * @function toolLink
 * @param tool {Tool} a tool from TOOLS
 * @returns {SiteLinkItem} a link for a live tool; the name with a "soon" note for one without a url
 */
const toolLink = (tool: Tool): SiteLinkItem =>
  tool.url ? { label: tool.name, href: tool.url } : { label: tool.name, note: "soon" };

/** The tools, centered in the header. */
export const HEADER_LINKS: readonly SiteLinkItem[] = TOOLS.map(toolLink);

/**
 * @function pageLinks
 * @param column {FooterColumnTitle} a footer column
 * @returns {SiteLinkItem[]} the pages PAGES puts in that column, in PAGES order, labeled by title
 */
const pageLinks = (column: FooterColumnTitle): SiteLinkItem[] =>
  PAGE_PATHS.filter(
    (path) => (PAGES[path] as { footer?: FooterColumnTitle }).footer === column,
  ).map((path) => ({ href: path, label: PAGES[path].title }));

/** The three footer columns, in order. /ui has no footer link: /libraries and the ui card reach it. */
export const FOOTER_COLUMNS: readonly SiteFooterColumn[] = [
  { title: "Tools", items: TOOLS.map(toolLink) },
  { title: "haruhime.moe", items: pageLinks("haruhime.moe") },
  {
    title: "Legal",
    items: CONTENT.entries.legal.map((e) => ({
      href: contentPath("legal", e.slug),
      label: e.title,
    })),
  },
];
