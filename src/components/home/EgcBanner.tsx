/**
 * @file src/components/home/EgcBanner.tsx
 * @desc Homepage banner for the Evergreen Cup: Evergreen Cup's own dark green ground and tree
 *       mark, linking to evergreencup.org. Sits above everything else on the homepage.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Thu Sep 24, 2026
 */

import { useId } from "react";
import { EVERGREEN_CUP } from "@/constants/site";

/** Evergreen Cup's tree mark, from evergreencup.org's icon. */
function EvergreenMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="size-12 shrink-0">
      <rect width="32" height="32" rx="7" fill="#0a301a" />
      <path
        d="M16 3 L21.5 10.5 L18.8 10.5 L23.3 17 L20.6 17 L25 23.5 L7 23.5 L11.4 17 L8.7 17 L13.2 10.5 L10.5 10.5 Z"
        fill="#49b86a"
      />
      <rect x="14.5" y="23.5" width="3" height="5" rx="0.5" fill="#6b4423" />
    </svg>
  );
}

/**
 * @function EgcBanner
 * @returns {JSX.Element} the Evergreen Cup banner
 */
export function EgcBanner() {
  const headingId = useId();
  return (
    <section
      aria-labelledby={headingId}
      className="flex flex-wrap items-center gap-4 rounded-[10px] bg-[#051a0d] p-5 text-[#d5f2de]"
    >
      <EvergreenMark />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h2 id={headingId} className="font-bold text-lg text-white">
          {EVERGREEN_CUP.name}
        </h2>
        <p className="text-sm">{EVERGREEN_CUP.line}</p>
      </div>
      <a
        href={EVERGREEN_CUP.url}
        target="_blank"
        rel="noopener"
        className="rounded-full bg-[#49b86a] px-4 py-2 font-bold text-[#051a0d] text-sm hover:bg-[#7cd293] focus-visible:outline-2 focus-visible:outline-[#aee5bd] focus-visible:outline-offset-2"
      >
        Visit evergreencup.org
      </a>
    </section>
  );
}
