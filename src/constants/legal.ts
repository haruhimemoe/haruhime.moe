/**
 * @file src/constants/legal.ts
 * @desc Dates that need a human to bump them: when the disclaimer last changed (bump it in the same
 *       commit as any wording change) and when /.well-known/security.txt expires (a test fails 60
 *       days ahead, so the date gets moved and the site redeployed before it lapses).
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Mon Sep 28, 2026
 */

/** ISO date (YYYY-MM-DD) of the disclaimer's last wording change. */
export const DISCLAIMER_UPDATED = "2026-09-23";

/**
 * security.txt's Expires (RFC 9116), in ISO 8601 UTC. The route renders once at build, so the date
 * is pinned here rather than computed. Keep it under a year out; tests/unit/constants/legal.test.ts
 * fails 60 days before it, which forces a bump and a redeploy.
 */
export const SECURITY_TXT_EXPIRES = "2027-09-01T00:00:00.000Z";
