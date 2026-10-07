/**
 * @file src/lib/discord.ts
 * @desc The hub's Discord link, from next-kit's createDiscordLinkRoutes: POST start, GET callback
 *       and POST unlink under /api/account/discord, writing only discordId and discordUsername on
 *       the identity user. Off while DISCORD_CLIENT_ID or DISCORD_CLIENT_SECRET is unset: every
 *       route answers 404 and /account hides the row, and the database is never touched.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import "server-only";

import { createDiscordLinkRoutes, discordLinkConfig } from "@haruhimemoe/next-kit/auth";
import { jsonError, noStore } from "@haruhimemoe/next-kit/server";
import { ObjectId } from "mongodb";
import { SITE } from "@/constants/site";
import { getServerEnv } from "@/env";
import { getUserFromHeaders } from "@/lib/auth";
import { connectDb, getIdentityDb } from "@/lib/db";

/**
 * @function discordEnabled
 * @returns {boolean} true when both Discord variables are set
 */
export const discordEnabled = (): boolean =>
  discordLinkConfig(process.env, process.env.BETTER_AUTH_URL ?? SITE.url) !== null;

type Routes = ReturnType<typeof createDiscordLinkRoutes>;
let routes: Routes | null = null;

const build = (): Routes => {
  const env = getServerEnv();
  return createDiscordLinkRoutes({
    config: discordLinkConfig(process.env, env.BETTER_AUTH_URL),
    identityDb: async () => {
      await connectDb();
      return getIdentityDb();
    },
    secret: env.BETTER_AUTH_SECRET,
    currentUser: (request) => getUserFromHeaders(request.headers),
    siteTitle: SITE.name,
  });
};

/**
 * @function discordRoute
 * @param handler {keyof Routes} start, callback or unlink
 * @returns {(request: Request) => Promise<Response>} 404 while the feature is off, else the
 *          next-kit handler (built once)
 */
export const discordRoute =
  (handler: keyof Routes) =>
  async (request: Request): Promise<Response> => {
    if (!discordEnabled()) return noStore(jsonError(404, "Not found."));
    routes ??= build();
    return routes[handler](request);
  };

/**
 * @function linkedDiscord
 * @param userId {string} the signed-in user's id
 * @returns {Promise<string | null>} their linked Discord username, or null
 */
export const linkedDiscord = async (userId: string): Promise<string | null> => {
  await connectDb();
  const doc = await getIdentityDb()
    .collection<{ discordUsername?: string }>("user")
    .findOne({ _id: new ObjectId(userId) }, { projection: { discordUsername: 1 } });
  return doc?.discordUsername ?? null;
};
