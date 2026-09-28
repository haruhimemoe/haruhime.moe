/**
 * @file src/constants/nav.ts
 * @desc The header and footer links, as data for @haruhimemoe/ui's SiteHeader and SiteFooter.
 *       Tools that haven't launched show as plain text marked "soon" and link nowhere. The page
 *       columns come from each page's footer column in PAGES.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Mon Sep 28, 2026
 */

import type { SiteFooterColumn, SiteLinkItem } from "@haruhimemoe/ui";
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

/** The three footer columns, in order. */
export const FOOTER_COLUMNS: readonly SiteFooterColumn[] = [
  { title: "Tools", items: TOOLS.map(toolLink) },
  { title: "haruhime.moe", items: pageLinks("haruhime.moe") },
  { title: "Legal", items: pageLinks("Legal") },
];
