/**
 * @file src/lib/inbox.ts
 * @desc The inbox (invites and notifications) in identity, from next-kit/inbox. The hub owns the
 *       store; satellites write through POST /api/internal/inbox with their account secret.
 *       buildIdentityIndexes builds its indexes on first connect.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import "server-only";

import { createInboxStore } from "@haruhimemoe/next-kit/inbox";
import { connectDb, getIdentityDb } from "@/lib/db";

/** The process-wide inbox store. */
export const inboxStore = createInboxStore(async () => {
  await connectDb();
  return getIdentityDb();
});
