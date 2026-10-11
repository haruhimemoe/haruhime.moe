/**
 * @file src/app/api/account/preferences/route.ts
 * @desc GET/POST: the signed-in user's time-display preferences (timezone, hour cycle), from
 *       next-kit's createPreferencesRoute on the identity database, same imports as the Discord
 *       link routes. GET answers 401 signed out. POST sits behind the same refusals as every
 *       other hub write: 403 cross-site, 401 signed out or a malformed session user id, 400 on a
 *       bad value (an unknown zone, say).
 *
 *       The route is built lazily, after connectDb() on first request, instead of calling
 *       getIdentityDb() at module load: matches every other hub route (connect, then touch the
 *       database), and keeps build and every page without a database from needing MONGODB_URI.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 11, 2026
 * @modified Sun Oct 11, 2026
 */

import { createPreferencesRoute } from "@haruhimemoe/next-kit/preferences/server";
import { getUserFromHeaders } from "@/lib/auth";
import { connectDb, getIdentityDb } from "@/lib/db";

let route: ReturnType<typeof createPreferencesRoute> | null = null;

const getRoute = async () => {
  await connectDb();
  route ??= createPreferencesRoute({
    db: getIdentityDb(),
    getSession: async (request) => {
      const user = await getUserFromHeaders(request.headers);
      return user ? { user: { id: user.id } } : null;
    },
  });
  return route;
};

export const GET = async (request: Request) => (await getRoute()).GET(request);
export const POST = async (request: Request) => (await getRoute()).POST(request);
