/**
 * @file src/components/layout/Header.tsx
 * @desc Site header: the small stacked wordmark linking home. No nav bar; the footer has the links.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

import Link from "next/link";
import { WORDMARK_SIZE } from "@/constants/brand";
import { SITE } from "@/constants/site";

/**
 * @function Header
 * @returns {JSX.Element} the top bar with the wordmark as a home link
 */
export function Header() {
  return (
    <header className="border-b4 border-b bg-b6">
      <div className="mx-auto flex max-w-5xl items-center px-4 py-3">
        <Link href="/" className="inline-flex">
          {/* biome-ignore lint/performance/noImgElement: static SVG, no optimization needed */}
          <img
            src="/brand/haruhime-wordmark.svg"
            alt={`${SITE.name} home`}
            width={WORDMARK_SIZE.width}
            height={WORDMARK_SIZE.height}
            className="h-8 w-auto"
          />
        </Link>
      </div>
    </header>
  );
}
