/**
 * @file src/lib/auth.ts
 * @desc better-auth for the hub, built on first use by @haruhimemoe/next-kit/auth's createOsuAuth
 *       on the identity database: osu! OAuth with PKCE, osu! trusted for account linking, no osu!
 *       tokens kept, errors to /signin?error=<code>, 30-day sessions refreshed daily, and the
 *       shared "haruhime-signed-in" marker following the session. With HUB_COOKIE_DOMAIN set
 *       (".haruhime.moe" in production) every better-auth cookie, OAuth state and PKCE too, sits
 *       on the parent domain so packs, pools and bb read the same session; that is safe only
 *       because sign-in starts and ends here. TRUSTED_ORIGINS lets sign-in land back on them.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { createOsuAuth, type OsuSessionUser, toSessionUser } from "@haruhimemoe/next-kit/auth";
import { SIGNED_IN_COOKIE, TRUSTED_ORIGINS } from "@/constants/accounts";
import { getHubCookieDomain, getServerEnv } from "@/env";
import { connectDb, getIdentityDb, getMongoClient } from "@/lib/db";

const createAuth = () => {
  const env = getServerEnv();
  const cookieDomain = getHubCookieDomain();
  return createOsuAuth({
    clientId: env.OSU_CLIENT_ID,
    clientSecret: env.OSU_CLIENT_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    db: getIdentityDb(),
    client: getMongoClient(),
    markerCookie: SIGNED_IN_COOKIE,
    ...(cookieDomain ? { cookieDomain } : {}),
    trustedOrigins: [...TRUSTED_ORIGINS],
  });
};

/** The better-auth instance's type, for the client's inferAdditionalFields. */
export type Auth = ReturnType<typeof createAuth>;

let instance: Auth | null = null;

/**
 * @function getAuth
 * @returns {Auth} the process-wide better-auth instance, built on first use
 */
export const getAuth = (): Auth => {
  instance ??= createAuth();
  return instance;
};

/** A signed-in user, with the id of the session this request carries. */
export type HubUser = OsuSessionUser & { sessionId: string };

/**
 * @function getUserFromHeaders
 * @param headers {Headers} request headers (the session cookie)
 * @returns {Promise<HubUser | null>} the signed-in user and their session's id; null for no
 *          session, a forged or expired one, or a banned user
 */
export const getUserFromHeaders = async (headers: Headers): Promise<HubUser | null> => {
  await connectDb();
  const session = await getAuth().api.getSession({ headers });
  if (!session) return null;
  // requireSession's rule, kept here because the page also needs the session's id.
  const user = toSessionUser(session);
  if (user.bannedAt) return null;
  return { ...user, sessionId: session.session.id };
};
