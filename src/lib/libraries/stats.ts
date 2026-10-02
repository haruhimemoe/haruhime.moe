/**
 * @file src/lib/libraries/stats.ts
 * @desc One record of a library's numbers for /libraries: version and license from npm, downloads
 *       over the last month, GitHub stars and the latest release. The four lookups run together
 *       and each field is null on its own failure, so one dead API never blanks the rest.
 * @author David @dvhsh (https://dvh.sh)
 * @created Fri Oct 2, 2026
 * @modified Fri Oct 2, 2026
 */

import type { Library } from "@/constants/libraries";
import {
  fetchGithubLatestRelease,
  fetchGithubRepo,
  type GithubRelease,
} from "@/lib/libraries/github";
import { fetchNpmDownloads, fetchNpmLatest } from "@/lib/libraries/npm";

/** A library's numbers. Every field is null when its source failed. */
export type LibraryStats = {
  readonly version: string | null;
  readonly license: string | null;
  readonly downloads: number | null;
  readonly stars: number | null;
  readonly release: GithubRelease | null;
};

/**
 * @function fetchLibraryStats
 * @param library {Library} the library
 * @returns {Promise<LibraryStats>} its stats, each null where the lookup failed
 */
export async function fetchLibraryStats(library: Library): Promise<LibraryStats> {
  const [latest, downloads, repo, release] = await Promise.all([
    fetchNpmLatest(library.pkg),
    fetchNpmDownloads(library.pkg),
    fetchGithubRepo(library.repo),
    fetchGithubLatestRelease(library.repo),
  ]);
  return {
    version: latest?.version ?? null,
    license: latest?.license ?? null,
    downloads,
    stars: repo?.stars ?? null,
    release,
  };
}
