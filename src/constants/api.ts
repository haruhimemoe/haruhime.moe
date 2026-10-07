/**
 * @file src/constants/api.ts
 * @desc Rate limits the hub counts, per osu! account. Counters live in rate_limits (src/lib/
 *       rate-limit.ts), the same collection name and shape pools and packs use.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

/** A fixed-window limit: its scope, how many hits, and the window in seconds. */
export type RateLimitRule = { scope: string; limit: number; windowSeconds: number };

/** Every rate limit the hub counts, per osu! account or per IP. */
export const RATE_LIMITS = {
  /** DELETE /api/account, per osu! account (it outlives the account it counts: deleting,
   * signing in again and deleting can't go round it). */
  accountDelete: { scope: "account-delete", limit: 3, windowSeconds: 3600 },
  /** GET /api/signin/osu, per IP: each hit writes a state cookie and an OAuth state. */
  signIn: { scope: "signin", limit: 30, windowSeconds: 600 },
} as const satisfies Record<string, RateLimitRule>;
