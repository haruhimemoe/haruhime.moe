/**
 * @file src/constants/nav.ts
 * @desc The header and footer links, as data for @haruhimemoe/ui's SiteHeader and SiteFooter.
 *       Tools that haven't launched show as plain text marked "soon" and link nowhere.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

import type { SiteFooterColumn, SiteLinkItem } from "@haruhimemoe/ui";
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

/** The three footer columns, in order. */
export const FOOTER_COLUMNS: readonly SiteFooterColumn[] = [
  { title: "Tools", items: TOOLS.map(toolLink) },
  {
    title: "haruhime.moe",
    items: [
      { href: "/thanks", label: "Thanks" },
      { href: "/brand", label: "Brand" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    items: [{ href: "/disclaimer", label: "Disclaimer" }],
  },
];
