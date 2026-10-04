/**
 * @file src/utils/changelog-feed.ts
 * @desc The /changelog feed from every repo's parsed changelog: releases newest first by date,
 *       then by repo label, same-day releases of one repo in file order, undated ones last,
 *       capped at FEED_LIMIT. Unreleased never shows here. Also which repos failed to load, so the
 *       page can say so. Pure.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Sun Oct 4, 2026
 */

import type { ChangelogKind, ChangelogSource } from "@/constants/changelogs";
import type { Changelog, Release } from "@/utils/changelog";

/** One repo's fetch: its parsed changelog, or a failure. */
export type ChangelogResult =
  | { readonly source: ChangelogSource; readonly changelog: Changelog }
  | { readonly source: ChangelogSource; readonly error: true };

/** One release in the feed, with its repo's link definitions. */
export type FeedEntry = {
  readonly source: ChangelogSource;
  readonly release: Release;
  readonly references: readonly string[];
};

/** The feed: its entries, whether older ones were cut, and the repos that failed to load. */
export type Feed = {
  readonly entries: readonly FeedEntry[];
  readonly more: boolean;
  readonly failed: readonly ChangelogSource[];
};

/** How many releases a feed shows. Older ones are on each repo's page. */
export const FEED_LIMIT = 30;

/** How many of the newest feed entries start open. */
export const FEED_OPEN = 5;

/**
 * @function buildFeed
 * @param results {readonly ChangelogResult[]} every fetched repo
 * @param kind {ChangelogKind | undefined} only this kind of repo (default every repo)
 * @returns {Feed} the newest FEED_LIMIT releases in feed order, whether more exist, and the
 *   failed repos within the filter
 */
export const buildFeed = (results: readonly ChangelogResult[], kind?: ChangelogKind): Feed => {
  const shown = results.filter((result) => kind === undefined || result.source.kind === kind);
  const all = shown.flatMap((result) =>
    "changelog" in result
      ? result.changelog.releases.map((release, order) => ({
          source: result.source,
          release,
          references: result.changelog.references,
          order,
        }))
      : [],
  );
  all.sort((a, b) => {
    const left = a.release.date;
    const right = b.release.date;
    if (left !== right) {
      if (left === null) return 1;
      if (right === null) return -1;
      return right.localeCompare(left);
    }
    return a.source.label.localeCompare(b.source.label, "en") || a.order - b.order;
  });
  return {
    entries: all.slice(0, FEED_LIMIT).map(({ source, release, references }) => ({
      source,
      release,
      references,
    })),
    more: all.length > FEED_LIMIT,
    failed: shown.filter((result) => "error" in result).map((result) => result.source),
  };
};
