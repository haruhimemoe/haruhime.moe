/**
 * @file src/utils/libraries-format.ts
 * @desc Text for the library stats: counts shortened past a thousand (1.2k, 34k), a release as
 *       its tag and day, and a dash for anything that failed to load.
 * @author David @dvhsh (https://dvh.sh)
 * @created Fri Oct 2, 2026
 * @modified Fri Oct 2, 2026
 */

import type { GithubRelease } from "@/lib/libraries/github";

/** What a stat shows when its lookup failed. */
export const MISSING = "—";

/**
 * @function formatCount
 * @param count {number | null} downloads or stars
 * @returns {string} the count: under 1,000 as is, then one decimal and a k (1.2k) up to 10k, then
 *   whole thousands (34k); MISSING for null
 */
export const formatCount = (count: number | null): string => {
  if (count === null) return MISSING;
  if (count < 1000) return String(count);
  // Tenths of a thousand, rounded, so 9,950 reads 10k and 1,234 reads 1.2k.
  const tenths = Math.round(count / 100);
  if (tenths < 100) return `${tenths / 10}k`;
  return `${Math.round(count / 1000)}k`;
};

/**
 * @function formatReleaseDate
 * @param iso {string} an ISO 8601 timestamp from GitHub
 * @returns {string} the day in words (Sep 28, 2026), in UTC so it's the same everywhere
 */
export const formatReleaseDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

/**
 * @function formatRelease
 * @param release {GithubRelease | null} the latest release
 * @returns {string} "v0.6.0, Sep 28, 2026", or "no release yet" for null
 */
export const formatRelease = (release: GithubRelease | null): string =>
  release ? `${release.tag}, ${formatReleaseDate(release.publishedAt)}` : "no release yet";
