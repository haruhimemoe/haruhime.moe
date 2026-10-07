/**
 * @file src/app/api/account/discord/start/route.ts
 * @desc POST: starts linking the signed-in user's Discord (src/lib/discord.ts), 10 an IP per 10
 *       minutes. 404 while Discord isn't configured.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { clientIp, noStore, rateLimitSubject } from "@haruhimemoe/next-kit/server";
import { RATE_LIMITS } from "@/constants/api";
import { discordEnabled, discordRoute } from "@/lib/discord";
import { limiter } from "@/lib/rate-limit";

const start = discordRoute("start");

export async function POST(request: Request) {
  if (discordEnabled()) {
    const limited = await limiter.refuseOverLimit(
      RATE_LIMITS.discordLink,
      rateLimitSubject(clientIp(request.headers)),
    );
    if (limited) return noStore(limited);
  }
  return start(request);
}
