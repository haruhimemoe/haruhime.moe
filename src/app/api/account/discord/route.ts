/**
 * @file src/app/api/account/discord/route.ts
 * @desc POST: unlinks the signed-in user's Discord (src/lib/discord.ts). 204; 404 while Discord
 *       isn't configured.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { discordRoute } from "@/lib/discord";

export const POST = discordRoute("unlink");
