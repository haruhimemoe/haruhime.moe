/**
 * @file src/components/layout/Footer.tsx
 * @desc Site footer, laid out like packs': Tools / haruhime.moe / Legal columns, a GitHub icon
 *       link and one line of fine print. Tools that haven't launched show as plain text marked
 *       "soon".
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
      { href: SITE.sourceRepo, label: "Source" },
    ],
  },
  {
    title: "Legal",
    items: [{ href: "/disclaimer", label: "Disclaimer" }],
  },
];

/** The GitHub mark, as a static inline SVG (no icon library, no external request). */
function GitHubIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="size-5" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

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
        <div className="flex flex-wrap items-center justify-between gap-4 border-b4 border-t pt-6">
          <p className="text-c4 text-xs">{SITE.trademarkNotice}</p>
          <Link
            href={SITE.githubOrg}
            aria-label="haruhimemoe on GitHub"
            className="shrink-0 text-c3 transition-colors hover:text-c1"
          >
            <GitHubIcon />
          </Link>
        </div>
      </div>
    </footer>
  );
}
