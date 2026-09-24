/**
 * @file src/components/layout/Header.tsx
 * @desc Site header: the small wordmark at the left, the three tools centered. packs links out;
 *       pools and sheets show dimmed with a "soon" marker, no link, until they get a url.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

import Link from "next/link";
import { WORDMARK_SIZE } from "@/constants/brand";
import { SITE } from "@/constants/site";
import { TOOLS } from "@/constants/tools";

/**
 * @function Header
 * @returns {JSX.Element} the top bar: the wordmark as a home link, the tools centered beside it
 */
export function Header() {
  return (
    <header className="border-b4 border-b bg-b6">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-4 px-4 py-3">
        <Link href="/" className="inline-flex shrink-0">
          {/* biome-ignore lint/performance/noImgElement: static SVG, no optimization needed */}
          <img
            src="/brand/haruhime-wordmark.svg"
            alt={`${SITE.name} home`}
            width={WORDMARK_SIZE.width}
            height={WORDMARK_SIZE.height}
            className="h-8 w-auto"
          />
        </Link>
        <nav
          aria-label="Tools"
          className="flex flex-1 flex-wrap items-center justify-center gap-x-6 gap-y-1"
        >
          {TOOLS.map((tool) =>
            tool.url ? (
              <Link
                key={tool.name}
                href={tool.url}
                className="font-bold text-c2 transition-colors hover:text-c1"
              >
                {tool.name}
              </Link>
            ) : (
              <span key={tool.name} aria-disabled="true" className="font-bold text-c4">
                {tool.name} <span className="text-xs uppercase tracking-wide">soon</span>
              </span>
            ),
          )}
        </nav>
      </div>
    </header>
  );
}
