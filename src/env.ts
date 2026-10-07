/**
 * @file src/env.ts
 * @desc The hub's server environment, wired from @haruhimemoe/next-kit/env: the osu! app's five
 *       variables (MONGODB_URI, BETTER_AUTH_URL, BETTER_AUTH_SECRET, OSU_CLIENT_ID,
 *       OSU_CLIENT_SECRET), validated with zod on first use (not at import), so `next build` and
 *       every page without the database build without them. SKIP_ENV_VALIDATION=true (CI) swaps
 *       missing values for placeholders nothing connects with, and a production server refuses
 *       that when a secret would be one of them. HUB_COOKIE_DOMAIN is read by its own getter:
 *       ".haruhime.moe" in production puts the session on every subdomain, unset locally keeps it
 *       on this host. Errors name variables and never print values.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import {
  createServerEnv,
  invalidEnv,
  OSU_APP_PLACEHOLDERS,
  OSU_APP_SECRET_KEYS,
  type OsuAppEnv,
  osuAppEnvSchema,
  readOptional,
} from "@haruhimemoe/next-kit/env";

/** The variables every signed-in request needs. */
export type ServerEnv = OsuAppEnv;

const serverEnv = createServerEnv({
  schema: osuAppEnvSchema,
  placeholders: OSU_APP_PLACEHOLDERS,
  secretKeys: OSU_APP_SECRET_KEYS,
});

/** Every variable in ServerEnv, for .env.example's test. */
export const SERVER_ENV_KEYS = serverEnv.keys;

/** The parent domain the session cookie is scoped to (".haruhime.moe" in production). */
export const HUB_COOKIE_DOMAIN_KEY = "HUB_COOKIE_DOMAIN";
/** The variables read on every call, for .env.example's test. */
export const OPTIONAL_ENV_KEYS = [HUB_COOKIE_DOMAIN_KEY] as const;

/** A leading dot, then a hostname: ".haruhime.moe", ".localhost". */
const COOKIE_DOMAIN = /^\.[a-z0-9-]+(?:\.[a-z0-9-]+)*$/;

/** Validates the server variables, trimmed (tests pass their own source). */
export const parseServerEnv = serverEnv.parse;

/**
 * @function getServerEnv
 * @returns {ServerEnv} process.env, validated once and memoized
 * @throws {EnvError} naming (never printing) each missing or invalid variable
 */
export const getServerEnv = (): ServerEnv => serverEnv.get();

/**
 * @function getDatabaseUri
 * @returns {string} MONGODB_URI from process.env, validated on its own
 * @throws {EnvError} when it's missing or invalid
 */
export const getDatabaseUri = (): string =>
  serverEnv.pick(process.env, ["MONGODB_URI"]).MONGODB_URI;

/**
 * @function getHubCookieDomain
 * @param source {Record<string, string | undefined>} the variables (default process.env)
 * @returns {string | undefined} HUB_COOKIE_DOMAIN read now, lowercased; undefined when unset, so
 *          the cookies stay on this host
 * @throws {EnvError} naming HUB_COOKIE_DOMAIN when it isn't a dot and a hostname
 */
export const getHubCookieDomain = (
  source: Record<string, string | undefined> = process.env,
): string | undefined => {
  const raw = readOptional(HUB_COOKIE_DOMAIN_KEY, source)?.toLowerCase();
  if (raw === undefined) return undefined;
  if (!COOKIE_DOMAIN.test(raw)) throw invalidEnv([HUB_COOKIE_DOMAIN_KEY]);
  return raw;
};
