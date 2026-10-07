/**
 * @file src/lib/rate-limit.ts
 * @desc The hub's rate limiter: next-kit's fixed-window counters in MongoDB (collection
 *       rate_limits, removed by the TTL index a minute after each window ends), on the identity
 *       database. The same pattern pools uses (src/lib/rate-limit.ts there). Subjects are
 *       next-kit's userSubject ("osu:<osuId>"), so a deleted and re-signed-in account still
 *       counts against its limits. Counting fails open: if the write fails, the request is
 *       allowed and the error logged.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import "server-only";

import { createRateLimiter, type RateLimiter, userSubject } from "@haruhimemoe/next-kit/server";
import { connectedDb } from "@/lib/db";

/** Where the hub's rate-limit counters live, on the identity database. */
export const RATE_LIMITS_COLLECTION = "rate_limits";

/**
 * The process-wide limiter on rate_limits. The clock is read on each call (not captured at
 * import), so tests with fake timers count in their own minute.
 */
export const limiter: RateLimiter = createRateLimiter({
  db: connectedDb,
  collection: RATE_LIMITS_COLLECTION,
  now: () => Date.now(),
});

/**
 * @function limitUser
 * @param rule {Parameters<RateLimiter["refuseOverLimit"]>[0]} the limit
 * @param user {{ osuId: number }} the caller
 * @returns {Promise<Response | null>} a no-store 429 when it's over the limit, otherwise null
 */
export const limitUser: (
  rule: Parameters<RateLimiter["refuseOverLimit"]>[0],
  user: { osuId: number },
) => ReturnType<RateLimiter["refuseOverLimit"]> = (rule, user) =>
  limiter.refuseOverLimit(rule, userSubject(user));
