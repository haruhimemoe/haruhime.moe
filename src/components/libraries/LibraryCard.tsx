/**
 * @file src/components/libraries/LibraryCard.tsx
 * @desc One library on /libraries: its README banner across the top (the same SVG the repo's
 *       README shows, from public/brand/repos), its name linking to its docs page (the link
 *       covers the whole card), the description, the install line, its stats and its links. The
 *       links sit above the card-wide cover so each one is its own click.
 * @author David @dvhsh (https://dvh.sh)
 * @created Fri Oct 2, 2026
 * @modified Sun Oct 4, 2026
 */

import { Card, Text } from "@haruhimemoe/ui";
import { LibraryLinks } from "@/components/libraries/LibraryLinks";
import { StatsRow } from "@/components/libraries/StatsRow";
import { type Library, libraryUrls } from "@/constants/libraries";
import type { LibraryStats } from "@/lib/libraries/stats";

/**
 * @function LibraryCard
 * @param props {{ library: Library; stats: LibraryStats }} the library and its numbers
 * @returns {JSX.Element} a list item holding the library's card
 */
export function LibraryCard({ library, stats }: { library: Library; stats: LibraryStats }) {
  return (
    <li className="flex">
      <Card className="relative flex w-full flex-col gap-4 overflow-hidden p-0 transition-colors focus-within:bg-b3 hover:bg-b3 [&>*:not(:first-child)]:mx-5 sm:[&>*:not(:first-child)]:mx-6 [&>:last-child]:mb-5 sm:[&>:last-child]:mb-6">
        {/* biome-ignore lint/performance/noImgElement: static SVG, no optimization needed */}
        <img
          src={`/brand/repos/${library.repo}-banner.svg`}
          alt=""
          width={1280}
          height={320}
          className="aspect-[4/1] w-full object-cover"
        />
        <div className="flex flex-col gap-1">
          <h2 className="font-extrabold text-c1 text-xl leading-tight">
            <a
              href={libraryUrls(library).docs}
              className="after:absolute after:inset-0 after:rounded-[10px]"
            >
              {library.pkg}
            </a>
          </h2>
          <Text tone="muted">{library.description}</Text>
        </div>
        <code className="w-fit rounded bg-b6 px-2 py-1 text-c2 text-sm">bun add {library.pkg}</code>
        <StatsRow stats={stats} />
        <LibraryLinks library={library} className="mt-auto" />
      </Card>
    </li>
  );
}
