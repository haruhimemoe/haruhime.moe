/**
 * @file src/components/changelog/ChangelogNav.tsx
 * @desc The changelog filters, as links (no JS, shareable): All, Apps, Packages, then every repo's
 *       page. The current one is marked aria-current="page", underlined and text-c1; the others
 *       are muted to font-normal text-c2.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Sun Oct 4, 2026
 */

import { TextLink } from "@haruhimemoe/ui";
import { CHANGELOG_FILTERS } from "@/constants/changelogs";

/**
 * @function ChangelogNav
 * @param props {{ current: string }} the path of the page showing it
 * @returns {JSX.Element} a nav named "Changelog filter" with every filter link
 */
export function ChangelogNav({ current }: { current: string }) {
  return (
    <nav aria-label="Changelog filter">
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
        {CHANGELOG_FILTERS.map((filter) => {
          const here = filter.href === current;
          return (
            <li key={filter.href}>
              <TextLink
                href={filter.href}
                variant="plain"
                aria-current={here ? "page" : undefined}
                className={here ? "text-c1 underline" : "font-normal text-c2"}
              >
                {filter.label}
              </TextLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
