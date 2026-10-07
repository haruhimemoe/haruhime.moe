/**
 * @file src/utils/signin.ts
 * @desc /signin's two inputs. resolveNext: where sign-in lands. A path goes through next-kit's
 *       safeNextPath (same site only); a full URL from packs, pools or bb goes through
 *       safeAbsoluteNext against HUB_HOSTS (https, no userinfo, the exact hostname). The hub is
 *       the authoritative check: a satellite's own hubSignInUrl is only a convenience. A URL back
 *       to this site's /signin, or anything else, lands on the fallback. signInErrorText: what
 *       the page says for each error code better-auth sends back (every failure lands on
 *       /signin?...&error=<code>); when a URL carries error twice, the last wins. Pure.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { DEFAULT_SIGN_IN_PATH, safeAbsoluteNext, safeNextPath } from "@haruhimemoe/next-kit/server";

/** resolveNext's options. */
export type ResolveNextOptions = {
  /** Full hostnames a URL `next` may point at (HUB_HOSTS). */
  hosts: readonly string[];
  /** Where to go when `next` is missing or unsafe. */
  fallback: string;
};

/**
 * @function resolveNext
 * @param raw {string | string[] | undefined} the page's `next` param (the first, when several)
 * @param options {ResolveNextOptions} the host allowlist and the fallback
 * @returns {string} a same-site path, a normalized https URL on an allowed host, or the fallback
 */
export const resolveNext = (
  raw: string | string[] | undefined,
  { hosts, fallback }: ResolveNextOptions,
): string => {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return fallback;
  if (value.startsWith("/")) return safeNextPath(value, { fallback });
  const url = safeAbsoluteNext(value, { hosts, fallback: "" });
  if (!url) return fallback;
  // Back to a /signin would hand off to itself forever.
  const { pathname } = new URL(url);
  if (pathname === DEFAULT_SIGN_IN_PATH || pathname.startsWith(`${DEFAULT_SIGN_IN_PATH}/`)) {
    return fallback;
  }
  return url;
};

/** Error codes and what they mean. */
export const SIGN_IN_ERRORS: readonly { codes: readonly string[]; text: string }[] = [
  {
    // better-auth's own codes when a user or session write fails (the database).
    codes: ["unable_to_create_user", "unable_to_create_session"],
    text: "Couldn't finish signing in. Try again, or tell us on Discord if it keeps happening.",
  },
  {
    codes: ["state_mismatch", "state_not_found", "please_restart_the_process"],
    text: "Sign-in took too long or started in another tab. Try again.",
  },
  {
    codes: ["access_denied"],
    text: "Sign-in was cancelled on osu!. Try again when you're ready.",
  },
  {
    codes: ["invalid_code", "no_code", "unable_to_get_user_info"],
    text: "osu! didn't confirm the sign-in. Try again.",
  },
];

const OTHER_ERROR = "Sign-in didn't finish. Try again.";

/**
 * @function signInErrorText
 * @param error {string | string[] | undefined} the page's `error` param (all of them, when
 *        there are several)
 * @returns {string | null} what to tell the person, from the last error given; null for none
 */
export const signInErrorText = (error: string | string[] | undefined): string | null => {
  const code = Array.isArray(error) ? error.at(-1) : error;
  if (code === undefined || code === "") return null;
  return SIGN_IN_ERRORS.find(({ codes }) => codes.includes(code))?.text ?? OTHER_ERROR;
};
