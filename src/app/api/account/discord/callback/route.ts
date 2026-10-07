/**
 * @file src/app/api/account/discord/callback/route.ts
 * @desc GET: Discord sends the user back here; links and returns to /account?discord=. 10 an IP per 10
 *       minutes. 404 while Discord isn't configured.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { clientIp, noStore, rateLimitSubject } from "@haruhimemoe/next-kit/server";
import { RATE_LIMITS } from "@/constants/api";
import { discordEnabled, discordRoute } from "@/lib/discord";
import { limiter } from "@/lib/rate-limit";

const callback = discordRoute("callback");

export async function GET(request: Request) {
  if (discordEnabled()) {
    const limited = await limiter.refuseOverLimit(
      RATE_LIMITS.discordLink,
      rateLimitSubject(clientIp(request.headers)),
    );
    if (limited) return noStore(limited);
  }
  return callback(request);
}
