/**
 * @file src/constants/nav.ts
 * @desc The header and footer links, as data for @haruhimemoe/ui's SiteHeader and SiteFooter.
 *       Tools that haven't launched show as plain text marked "soon" and link nowhere. The page
 *       haruhime.moe column comes from each page's footer column in PAGES, the Legal column from
 *       the content registry's legal pages (at /legal/<slug>).
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Sun Oct 11, 2026
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
const toolLink =
  (soon: string) =>
  (tool: Tool): SiteLinkItem =>
    tool.url ? { label: tool.name, href: tool.url } : { label: tool.name, note: soon };

/** A translator: next-intl's t for "hub" or "common". */
type T = (key: string) => string;

/**
 * @function headerLinks
 * @param t {T} the "hub" translator
 * @returns {SiteLinkItem[]} the tools, centered in the header
 */
export const headerLinks = (t: T): SiteLinkItem[] => TOOLS.map(toolLink(t("nav.soon")));

/**
 * @function pageLinks
 * @param column {FooterColumnTitle} a footer column
 * @param t {T} the "hub" translator
 * @returns {SiteLinkItem[]} the pages PAGES puts in that column, in PAGES order, labeled by title
 */
const pageLinks = (column: FooterColumnTitle, t: T): SiteLinkItem[] =>
  PAGE_PATHS.filter(
    (path) => (PAGES[path] as { footer?: FooterColumnTitle }).footer === column,
  ).map((path) => ({ href: path, label: t(`pageTitles.${path.slice(1) || "home"}`) }));

/**
 * @function footerColumns
 * @param t {T} the "hub" translator
 * @param common {T} the "common" translator
 * @returns {SiteFooterColumn[]} the three footer columns, in order. /ui has no footer link:
 *          /libraries and the ui card reach it. Legal page titles stay English, like the pages.
 */
export const footerColumns = (t: T, common: T): SiteFooterColumn[] => [
  { title: t("nav.tools"), items: TOOLS.map(toolLink(t("nav.soon"))) },
  { title: "haruhime.moe", items: pageLinks("haruhime.moe", t) },
  {
    title: common("footer.legal"),
    items: CONTENT.entries.legal.map((e) => ({
      href: contentPath("legal", e.slug),
      label: e.title,
    })),
  },
];
