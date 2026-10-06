/**
 * @file src/utils/library-nav.ts
 * @desc The library pages' ContentNav group: every package in LIBRARIES order, its short name as
 *       the label and its npm version as the badge. Pure.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { ContentNavGroup } from "@haruhimemoe/ui";
import { LIBRARIES, libraryUrls } from "@/constants/libraries";

/**
 * @function libraryNavGroups
 * @param versions {ReadonlyMap<string, string>} each library's name to its npm version; a
 *   library without one gets no badge
 * @returns {ContentNavGroup[]} one "Packages" group listing every library's docs page
 */
export const libraryNavGroups = (versions: ReadonlyMap<string, string>): ContentNavGroup[] => [
  {
    heading: "Packages",
    items: LIBRARIES.map((library) => {
      const version = versions.get(library.name);
      return {
        href: libraryUrls(library).docs,
        title: library.pkg,
        navTitle: library.name,
        ...(version ? { badge: version } : {}),
      };
    }),
  },
];
