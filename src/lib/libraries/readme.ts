/**
 * @file src/lib/libraries/readme.ts
 * @desc The README /libraries/<name> renders: fetched raw from the repo's main branch, cached by
 *       Next for a day, prepared by src/utils/readme. Null on any failure, so the page can offer
 *       the README on GitHub instead.
 * @author David @dvhsh (https://dvh.sh)
 * @created Fri Oct 2, 2026
 * @modified Fri Oct 2, 2026
 */

import { type Library, libraryUrls } from "@/constants/libraries";
import { STATS_REVALIDATE, STATS_USER_AGENT } from "@/lib/libraries/fetch-json";
import { prepareReadme } from "@/utils/readme";

/**
 * @function fetchReadme
 * @param library {Library} the library
 * @returns {Promise<string | null>} its README, prepared for rendering, or null
 */
export async function fetchReadme(library: Library): Promise<string | null> {
  try {
    const response = await fetch(libraryUrls(library).readme, {
      headers: { "user-agent": STATS_USER_AGENT },
      next: { revalidate: STATS_REVALIDATE },
    });
    if (!response.ok) return null;
    return prepareReadme(await response.text(), library.repo);
  } catch {
    return null;
  }
}
