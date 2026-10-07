/**
 * @file src/lib/db.ts
 * @desc The hub's MongoDB, from next-kit's createMongo: one MongoClient per process, built on
 *       first use (never at import, so every page without the database builds and renders with no
 *       env), state on globalThis so dev reloads don't leak clients, and a failed connect never
 *       cached. The hub owns the "identity" database (users, osu! links, sessions), so it is both
 *       the app database and the identity one, and the hub's database user needs readWrite on it.
 *       Only the hub builds identity's indexes (buildIdentityIndexes, on first connect):
 *       satellites read it with a read-only user.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { buildIdentityIndexes, createMongo } from "@haruhimemoe/next-kit/mongo";
import { getDatabaseUri } from "@/env";

/** The one database the hub uses: the shared identity. */
export const DB_NAME = "identity";

const mongo = createMongo({
  dbName: DB_NAME,
  identityDbName: DB_NAME,
  globalKey: "__hubMongo",
  uri: getDatabaseUri,
  onConnect: async ({ db }) => {
    await buildIdentityIndexes(db);
  },
});

/** The shared client (connects lazily on first operation). */
export const getMongoClient = mongo.getMongoClient;

/** The identity database on the shared client. */
export const getIdentityDb = mongo.getIdentityDb;

/** Connects once and builds identity's indexes. */
export const connectDb = mongo.connectDb;

/** The identity database once connectDb has resolved (the rate limiter's counters live on it). */
export const connectedDb = mongo.connectedDb;

/** Closes the client and forgets it (tests). */
export const closeDb = mongo.closeDb;
