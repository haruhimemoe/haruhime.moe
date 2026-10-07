/**
 * @file src/app/api/internal/inbox/route.ts
 * @desc POST: satellites write invites and notifications into identity's inbox, authorized by
 *       their account secret (the app comes from the secret that matched, never the body).
 *       503 while no app has a secret; wrong bearers are counted per IP.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { createInboxRoutes } from "@haruhimemoe/next-kit/inbox";
import { ACCOUNT_APPS } from "@/constants/accounts";
import { RATE_LIMITS } from "@/constants/api";
import { inboxStore } from "@/lib/inbox";
import { limiter } from "@/lib/rate-limit";

const routes = createInboxRoutes({
  store: inboxStore,
  apps: ACCOUNT_APPS,
  env: process.env,
  failures: { limiter, rule: RATE_LIMITS.inboxFailures },
});

export const POST = routes.post;
