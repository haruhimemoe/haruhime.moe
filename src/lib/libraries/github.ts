/**
 * @file src/lib/libraries/github.ts
 * @desc What /libraries reads from GitHub: a repo's star count and its latest release's tag and
 *       date. Unauthenticated (60 requests an hour is plenty for a daily revalidate). Null on any
 *       failure, including a repo that has no release yet (GitHub answers 404).
 * @author David @dvhsh (https://dvh.sh)
 * @created Fri Oct 2, 2026
 * @modified Fri Oct 2, 2026
 */

import { fetchJson, isRecord } from "@/lib/libraries/fetch-json";

const API = "https://api.github.com/repos/haruhimemoe";
const HEADERS = { accept: "application/vnd.github+json" };

/** A repo's latest release. */
export type GithubRelease = { readonly tag: string; readonly publishedAt: string };

/**
 * @function fetchGithubRepo
 * @param repo {string} the repo name under haruhimemoe
 * @returns {Promise<{ stars: number } | null>} its star count, or null
 */
export async function fetchGithubRepo(repo: string): Promise<{ stars: number } | null> {
  const body = await fetchJson(`${API}/${repo}`, HEADERS);
  if (!isRecord(body) || typeof body.stargazers_count !== "number") return null;
  return { stars: body.stargazers_count };
}

/**
 * @function fetchGithubLatestRelease
 * @param repo {string} the repo name under haruhimemoe
 * @returns {Promise<GithubRelease | null>} the latest release's tag and publish date, or null
 *   (a repo with no release yet is null too)
 */
export async function fetchGithubLatestRelease(repo: string): Promise<GithubRelease | null> {
  const body = await fetchJson(`${API}/${repo}/releases/latest`, HEADERS);
  if (!isRecord(body) || typeof body.tag_name !== "string") return null;
  if (typeof body.published_at !== "string") return null;
  return { tag: body.tag_name, publishedAt: body.published_at };
}
