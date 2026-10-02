/**
 * @file src/lib/libraries/fetch-json.ts
 * @desc The one fetch the library stats share: a GET with our User-Agent, cached by Next for a
 *       day, that gives back the parsed JSON body or null. Null covers everything that can go
 *       wrong (a non-2xx status, a network error, a body that isn't JSON) so a caller never
 *       throws and a dead API shows as a missing number, not a broken page.
 * @author David @dvhsh (https://dvh.sh)
 * @created Fri Oct 2, 2026
 * @modified Fri Oct 2, 2026
 */

import { SITE } from "@/constants/site";

/** How long Next keeps a stats response before fetching again: one day, in seconds. */
export const STATS_REVALIDATE = 86400;

/** How our requests identify themselves to npm and GitHub. */
export const STATS_USER_AGENT = `${SITE.name} (${SITE.url})`;

/**
 * @function fetchJson
 * @param url {string} the URL to GET
 * @param headers {Record<string, string>} extra request headers (the User-Agent is always set)
 * @returns {Promise<unknown>} the parsed body, or null on any failure
 */
export async function fetchJson(
  url: string,
  headers: Record<string, string> = {},
): Promise<unknown> {
  try {
    const response = await fetch(url, {
      headers: { "user-agent": STATS_USER_AGENT, ...headers },
      next: { revalidate: STATS_REVALIDATE },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * @function isRecord
 * @param value {unknown} a parsed body
 * @returns {boolean} true for a plain object (not null, not an array)
 */
export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
