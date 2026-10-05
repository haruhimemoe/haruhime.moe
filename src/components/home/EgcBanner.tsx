/**
 * @file src/components/home/EgcBanner.tsx
 * @desc Homepage banner for the Evergreen Cup: Evergreen Cup's own Seattle skyline art (the
 *       hero loop from evergreencup.org, clouds drifting over the Space Needle and a line of
 *       conifers) under its name, its line and one link to evergreencup.org. The poster paints at
 *       once; the muted looping video mounts after hydration through @haruhimemoe/ui's
 *       useMotionAllowed, and only when the visitor hasn't asked for reduced motion, so they
 *       never download it otherwise. Sits above everything
 *       else on the homepage, so its name is a plain paragraph, not a heading: the page's h1
 *       comes first in the outline. Short and wide on desktop, taller on phones so the Space
 *       Needle stays in frame beside the copy.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Mon Oct 5, 2026
 */

"use client";

import { CardLink, useMotionAllowed } from "@haruhimemoe/ui";
import { useId } from "react";
import { EVERGREEN_CUP } from "@/constants/site";

/** The skyline loop and its first frame, re-encoded from evergreencup.org's hero at 1600x900. */
const ART = {
  poster: "/egc/skyline-poster.webp",
  webm: "/egc/skyline.webm",
  mp4: "/egc/skyline.mp4",
} as const;

/** Where the art sits in the crop: the Space Needle left of center, the trees along the bottom. */
const ART_CLASS = "absolute inset-0 size-full object-cover object-[35%_85%]";

/**
 * @function EgcBanner
 * @returns {JSX.Element} the Evergreen Cup banner: skyline art, name, line and the site link,
 *   which covers the whole card
 */
export function EgcBanner() {
  const headingId = useId();
  const motion = useMotionAllowed();
  return (
    <section
      aria-labelledby={headingId}
      className="relative isolate flex aspect-[2/1] overflow-hidden rounded-[10px] bg-[#051a0d] text-white sm:aspect-[3/1] lg:aspect-[4/1]"
    >
      {/* biome-ignore lint/performance/noImgElement: full-bleed decorative art, sized by the card */}
      <img
        src={ART.poster}
        alt=""
        width={1600}
        height={900}
        fetchPriority="high"
        className={ART_CLASS}
      />
      {motion ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          poster={ART.poster}
          className={ART_CLASS}
        >
          <source src={ART.webm} type="video/webm" />
          <source src={ART.mp4} type="video/mp4" />
        </video>
      ) : null}
      {/* Scrim: Evergreen Cup's ground color, fading upward on phones and rightward when wide. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[#051a0d]/95 via-[#051a0d]/60 to-[#051a0d]/10 sm:bg-gradient-to-r sm:via-[#051a0d]/55 sm:to-transparent"
      />
      <div className="relative flex min-w-0 grow flex-col justify-end gap-3 p-5 sm:max-w-[60%] sm:justify-center sm:p-7 lg:max-w-[50%] lg:p-9">
        <div className="flex flex-col gap-1">
          <p
            id={headingId}
            className="font-extrabold text-2xl leading-none tracking-tight sm:text-3xl lg:text-4xl"
          >
            {EVERGREEN_CUP.name}
          </p>
          <p className="text-[#aee5bd] text-sm sm:text-base">{EVERGREEN_CUP.line}</p>
        </div>
        {/* CardLink brings the cover (after:absolute after:inset-0) so the banner is one click target. */}
        <CardLink
          href={EVERGREEN_CUP.url}
          target="_blank"
          rel="noopener"
          className="w-fit rounded-full bg-[#49b86a] px-4 py-2 font-bold text-[#051a0d] text-sm transition-colors after:rounded-[10px] hover:bg-[#7cd293] focus-visible:outline-2 focus-visible:outline-[#aee5bd] focus-visible:outline-offset-2"
        >
          evergreencup.org
        </CardLink>
      </div>
    </section>
  );
}
