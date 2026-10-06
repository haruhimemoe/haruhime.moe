/**
 * @file src/utils/changelog-nav.ts
 * @desc The changelog pages' ContentNav groups: Apps, Packages and Claude plugin, in
 *       KIND_HEADINGS order. A kind with a /changelog/kind/<segment> feed lists that feed first
 *       ("All apps"), then each repo's page with its latest version as the badge. Pure.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { ContentNavGroup, ContentNavItem } from "@haruhimemoe/ui";
import {
  CHANGELOG_SOURCES,
  type ChangelogKind,
  changelogUrls,
  KIND_HEADINGS,
  KIND_SEGMENTS,
  type KindSegment,
} from "@/constants/changelogs";

/**
 * @function changelogNavGroups
 * @param versions {ReadonlyMap<string, string>} each repo's slug to its latest version
 *   (latestVersions); a repo without one gets no badge
 * @returns {ContentNavGroup[]} one group per kind, each kind's feed first when it has one
 */
export const changelogNavGroups = (versions: ReadonlyMap<string, string>): ContentNavGroup[] =>
  (Object.keys(KIND_HEADINGS) as ChangelogKind[]).map((kind) => {
    const segment = (Object.keys(KIND_SEGMENTS) as KindSegment[]).find(
      (key) => KIND_SEGMENTS[key].kind === kind,
    );
    const feed: ContentNavItem[] = segment
      ? [
          {
            href: `/changelog/kind/${segment}`,
            title: `All ${KIND_SEGMENTS[segment].label.toLowerCase()}`,
          },
        ]
      : [];
    const repos = CHANGELOG_SOURCES.filter((source) => source.kind === kind).map(
      (source): ContentNavItem => {
        const version = versions.get(source.slug);
        return {
          href: changelogUrls(source).page,
          title: `${source.label} changelog`,
          navTitle: source.kind === "plugin" ? source.repo : source.label,
          ...(version ? { badge: version } : {}),
        };
      },
    );
    return { heading: KIND_HEADINGS[kind], items: [...feed, ...repos] };
  });
