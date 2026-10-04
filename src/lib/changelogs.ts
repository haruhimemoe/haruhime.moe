/**
 * @file src/lib/changelogs.ts
 * @desc Each repo's CHANGELOG.md, the way /libraries/<name> gets READMEs: fetched raw from main
 *       with our User-Agent, cached by Next for a day, relative links pointed at GitHub, then
 *       parsed. A failed fetch is a result, never a throw, so one dead repo can't break a page.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Sun Oct 4, 2026
 */

import { CHANGELOG_SOURCES, type ChangelogSource, changelogUrls } from "@/constants/changelogs";
import { STATS_REVALIDATE, STATS_USER_AGENT } from "@/lib/libraries/fetch-json";
import { parseChangelog } from "@/utils/changelog";
import type { ChangelogResult } from "@/utils/changelog-feed";
import { rewriteRelativeUrls } from "@/utils/readme";

/**
 * @function fetchChangelog
 * @param source {ChangelogSource} the repo
 * @returns {Promise<ChangelogResult>} its parsed changelog, or `{ source, error: true }`
 */
export async function fetchChangelog(source: ChangelogSource): Promise<ChangelogResult> {
  try {
    const response = await fetch(changelogUrls(source).raw, {
      headers: { "user-agent": STATS_USER_AGENT },
      next: { revalidate: STATS_REVALIDATE },
    });
    if (!response.ok) return { source, error: true };
    const markdown = rewriteRelativeUrls(await response.text(), source.repo);
    return { source, changelog: parseChangelog(markdown) };
  } catch {
    return { source, error: true };
  }
}

/**
 * @function fetchAllChangelogs
 * @param sources {readonly ChangelogSource[]} the repos (default every one)
 * @returns {Promise<ChangelogResult[]>} one result per repo, in the same order; never rejects
 */
export const fetchAllChangelogs = (
  sources: readonly ChangelogSource[] = CHANGELOG_SOURCES,
): Promise<ChangelogResult[]> => Promise.all(sources.map((source) => fetchChangelog(source)));
