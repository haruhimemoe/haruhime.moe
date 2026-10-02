/**
 * @file src/lib/libraries/npm.ts
 * @desc What /libraries reads from npm: the latest version and license from the registry, and
 *       last month's download count from the downloads API. Both are public, keyless, and cached
 *       for a day. Null on any failure.
 * @author David @dvhsh (https://dvh.sh)
 * @created Fri Oct 2, 2026
 * @modified Fri Oct 2, 2026
 */

import { fetchJson, isRecord } from "@/lib/libraries/fetch-json";

/** A package's latest publish: its version, and its license when package.json names one. */
export type NpmLatest = { readonly version: string; readonly license: string | null };

/**
 * @function fetchNpmLatest
 * @param pkg {string} the npm package name, scope included
 * @returns {Promise<NpmLatest | null>} the latest dist-tag's version and license, or null
 */
export async function fetchNpmLatest(pkg: string): Promise<NpmLatest | null> {
  // The registry wants the scope's slash encoded in a package path.
  const body = await fetchJson(`https://registry.npmjs.org/${pkg.replace("/", "%2F")}/latest`);
  if (!isRecord(body) || typeof body.version !== "string") return null;
  return { version: body.version, license: typeof body.license === "string" ? body.license : null };
}

/**
 * @function fetchNpmDownloads
 * @param pkg {string} the npm package name, scope included
 * @returns {Promise<number | null>} downloads over the last month, or null
 */
export async function fetchNpmDownloads(pkg: string): Promise<number | null> {
  const body = await fetchJson(`https://api.npmjs.org/downloads/point/last-month/${pkg}`);
  if (!isRecord(body) || typeof body.downloads !== "number") return null;
  return body.downloads;
}
