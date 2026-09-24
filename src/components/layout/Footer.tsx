/**
 * @file src/components/layout/Footer.tsx
 * @desc Site footer, laid out like packs': Tools / haruhime.moe / Legal columns and one line of
 *       fine print. Tools that haven't launched show as plain text marked "soon".
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

import Link from "next/link";
import { SITE } from "@/constants/site";
import { TOOLS } from "@/constants/tools";

/** A footer entry. Without `href` it's plain text (a tool that isn't live yet). */
type FooterItem = { label: string; href?: string; note?: string };

/** The three footer columns, in order. */
export const FOOTER_COLUMNS: readonly { title: string; items: readonly FooterItem[] }[] = [
  {
    title: "Tools",
    items: TOOLS.map((tool) =>
      tool.url ? { label: tool.name, href: tool.url } : { label: tool.name, note: "soon" },
    ),
  },
  {
    title: "haruhime.moe",
    items: [
      { href: "/thanks", label: "Thanks" },
      { href: "/brand", label: "Brand" },
      { href: "/contact", label: "Contact" },
      { href: SITE.githubOrg, label: "GitHub" },
      { href: SITE.sourceRepo, label: "Source on GitHub" },
    ],
  },
  {
    title: "Legal",
    items: [{ href: "/disclaimer", label: "Disclaimer" }],
  },
];

/**
 * @function Footer
 * @returns {JSX.Element} the site footer
 */
export function Footer() {
  return (
    <footer className="border-b4 border-t bg-b6 text-c3 text-sm">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-3">
          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="mb-3 font-bold text-c4 text-xs uppercase tracking-wide">
                {column.title}
              </p>
              <ul className="flex flex-col gap-2">
                {column.items.map((item) => (
                  <li key={item.label}>
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="wrap-anywhere transition-colors hover:text-c1"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span>
                        {item.label}{" "}
                        <span className="text-c4 text-xs uppercase tracking-wide">{item.note}</span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="border-b4 border-t pt-6">
          <p className="text-c4 text-xs">{SITE.trademarkNotice}</p>
        </div>
      </div>
    </footer>
  );
}
