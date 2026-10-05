/**
 * @file src/utils/changelog-filters.ts
 * @desc The changelog filter links (All, each kind, every repo) as LinkRow items, the one
 *       matching the current page marked current.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Oct 5, 2026
 * @modified Mon Oct 5, 2026
 */

import type { LinkRowItem } from "@haruhimemoe/ui";
import { CHANGELOG_FILTERS } from "@/constants/changelogs";

/**
 * @function changelogFilterItems
 * @param current {string} the path of the page showing the filters
 * @returns {LinkRowItem[]} every filter link, the current one marked
 */
export const changelogFilterItems = (current: string): LinkRowItem[] =>
  CHANGELOG_FILTERS.map((filter) => ({
    href: filter.href,
    label: filter.label,
    current: filter.href === current,
  }));
