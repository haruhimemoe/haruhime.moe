/**
 * @file src/components/libraries/LibraryLinks.tsx
 * @desc The links under a library, on its card and its docs page: GitHub, npm, the changelog page
 *       here and, for ui, the showcase. The docs link is the card's own (its name), so it isn't
 *       here.
 * @author David @dvhsh (https://dvh.sh)
 * @created Fri Oct 2, 2026
 * @modified Sun Oct 4, 2026
 */

import { cx, TextLink } from "@haruhimemoe/ui";
import { type Library, libraryUrls } from "@/constants/libraries";

/**
 * @function LibraryLinks
 * @param props {{ library: Library; className?: string }} the library
 * @returns {JSX.Element} a list of its external links, plus the showcase when it has one
 */
export function LibraryLinks({ library, className }: { library: Library; className?: string }) {
  const urls = libraryUrls(library);
  const links: readonly [string, string][] = [
    ["GitHub", urls.github],
    ["npm", urls.npm],
    ["Changelog", urls.changelogPage],
    ...(library.showcase ? ([["Showcase", library.showcase]] as [string, string][]) : []),
  ];
  return (
    <ul className={cx("flex flex-wrap gap-x-4 gap-y-1 text-sm", className)}>
      {links.map(([label, href]) => (
        <li key={label}>
          <TextLink href={href} className="relative z-10 font-bold">
            {label}
          </TextLink>
        </li>
      ))}
    </ul>
  );
}
