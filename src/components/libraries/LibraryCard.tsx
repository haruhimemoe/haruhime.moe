/**
 * @file src/components/libraries/LibraryCard.tsx
 * @desc One library on /libraries: its README banner across the top as LinkCard's media, its name
 *       linking to its docs page (the card is one click target), the description, the install
 *       chip, its stats and its links, lifted above the card-wide cover.
 * @author David @dvhsh (https://dvh.sh)
 * @created Fri Oct 2, 2026
 * @modified Mon Oct 5, 2026
 */

import { CardLink, CodeChip, LinkCard, LinkRow, StatList, Text } from "@haruhimemoe/ui";
import { type Library, libraryLinkItems, libraryUrls } from "@/constants/libraries";
import type { LibraryStats } from "@/lib/libraries/stats";
import { libraryStatItems } from "@/utils/libraries-format";

/**
 * @function LibraryCard
 * @param props {{ library: Library; stats: LibraryStats }} the library and its numbers
 * @returns {JSX.Element} the library's card
 */
export function LibraryCard({ library, stats }: { library: Library; stats: LibraryStats }) {
  return (
    <LinkCard
      media={
        // biome-ignore lint/performance/noImgElement: static SVG, no optimization needed
        <img
          src={`/brand/repos/${library.repo}-banner.svg`}
          alt=""
          width={1280}
          height={320}
          className="aspect-[4/1] w-full object-cover"
        />
      }
    >
      <div className="flex flex-col gap-1">
        <h2 className="font-extrabold text-c1 text-xl leading-tight">
          <CardLink href={libraryUrls(library).docs} className="font-extrabold">
            {library.pkg}
          </CardLink>
        </h2>
        <Text tone="muted">{library.description}</Text>
      </div>
      <CodeChip code={`bun add ${library.pkg}`} copy={false} />
      <StatList items={libraryStatItems(stats)} />
      <LinkRow items={libraryLinkItems(library)} className="mt-auto" />
    </LinkCard>
  );
}
