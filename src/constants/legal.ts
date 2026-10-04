/**
 * @file src/constants/legal.ts
 * @desc The date that needs a human to bump it: when /.well-known/security.txt expires (a test
 *       fails 60 days ahead, so the date gets moved and the site redeployed before it lapses). The
 *       legal pages' dates live in the content registry (src/constants/content.ts).
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Sun Oct 4, 2026
 */

/**
 * security.txt's Expires (RFC 9116), in ISO 8601 UTC. The route renders once at build, so the date
 * is pinned here rather than computed. Keep it under a year out; tests/unit/constants/legal.test.ts
 * fails 60 days before it, which forces a bump and a redeploy.
 */
export const SECURITY_TXT_EXPIRES = "2027-09-01T00:00:00.000Z";
