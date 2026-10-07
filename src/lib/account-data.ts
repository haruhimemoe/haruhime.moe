/**
 * @file src/lib/account-data.ts
 * @desc Account export and delete across every app, from next-kit/account's fanOut over
 *       ACCOUNT_APPS. Export bundles the identity record (no tokens, no sessions) with whatever
 *       each configured app returned. Delete fans out first and removes the identity user, their
 *       inbox entries and sessions only when every app answered 2xx; an unconfigured app stops
 *       it before any app is called.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import "server-only";

import {
  type ExportBundle,
  exportBundle,
  type FanOutReport,
  fanOut,
} from "@haruhimemoe/next-kit/account";
import { ObjectId } from "mongodb";
import { ACCOUNT_APPS } from "@/constants/accounts";
import { connectDb, getIdentityDb } from "@/lib/db";
import { inboxStore } from "@/lib/inbox";
import { deleteIdentity } from "@/lib/sessions";

/**
 * @function exportAccount
 * @param userId {string} the signed-in user's id
 * @returns {Promise<ExportBundle>} their identity record and each app's data
 */
export const exportAccount = async (userId: string): Promise<ExportBundle> => {
  await connectDb();
  const identity = await getIdentityDb()
    .collection("user")
    .findOne(
      { _id: new ObjectId(userId) },
      {
        projection: {
          name: 1,
          osuId: 1,
          image: 1,
          discordId: 1,
          discordUsername: 1,
          locale: 1,
          createdAt: 1,
        },
      },
    );
  const report = await fanOut({ apps: ACCOUNT_APPS, op: "export", userId, env: process.env });
  return exportBundle(identity, report.results);
};

/**
 * @function deleteAccount
 * @param user {{ id: string; osuId: number }} the signed-in user
 * @returns {Promise<FanOutReport>} ok once every app and the identity are gone; otherwise
 *          nothing in identity was touched
 */
export const deleteAccount = async (user: { id: string; osuId: number }): Promise<FanOutReport> => {
  const report = await fanOut({
    apps: ACCOUNT_APPS,
    op: "delete",
    userId: user.id,
    env: process.env,
  });
  if (!report.ok) return report;
  await inboxStore.deleteFor(user.id, user.osuId);
  await deleteIdentity(user.id);
  return report;
};
