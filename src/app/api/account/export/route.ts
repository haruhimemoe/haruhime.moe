/**
 * @file src/app/api/account/export/route.ts
 * @desc GET: the signed-in user's data as one JSON download: their identity record and each
 *       app's export (src/lib/account-data.ts). Apps without a secret are listed as
 *       not_configured. 5 an hour per osu! account. Never cached.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { jsonError, noStore } from "@haruhimemoe/next-kit/server";
import { RATE_LIMITS } from "@/constants/api";
import { exportAccount } from "@/lib/account-data";
import { getUserFromHeaders } from "@/lib/auth";
import { limitUser } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const user = await getUserFromHeaders(request.headers);
  if (!user) return noStore(jsonError(401, "Sign in first."));
  const limited = await limitUser(RATE_LIMITS.accountExport, user);
  if (limited) return limited;
  const bundle = await exportAccount(user.id);
  return noStore(
    new Response(JSON.stringify(bundle, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="haruhime-${user.osuId}.json"`,
      },
    }),
  );
}
