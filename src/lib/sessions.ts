/**
 * @file src/lib/sessions.ts
 * @desc A signed-in user's own sessions and account, through better-auth's internal adapter on
 *       the identity database. better-auth's own /list-sessions refuses a session older than a
 *       day (freshAge), so /account reads and revokes here instead; callers have already checked
 *       the session. Session tokens never leave the server: the page gets ids, and a revoke looks
 *       the token up by id among the caller's own sessions. Deleting an account removes the
 *       identity user, their osu! link and every session; each app's own data goes with the
 *       account fan-out, which isn't built yet.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { getAuth } from "@/lib/auth";
import { describeDevice, formatSessionDay } from "@/utils/sessions";

/** One session as /account shows it. */
export type SessionRow = {
  id: string;
  /** The session this request carries. */
  current: boolean;
  device: string;
  signedIn: string;
  lastActive: string;
};

type StoredSession = {
  id: string;
  token: string;
  userAgent?: string | null;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
};

const adapter = async () => (await getAuth().$context).internalAdapter;

const activeSessions = async (userId: string): Promise<StoredSession[]> =>
  (await (await adapter()).listSessions(userId, { onlyActiveSessions: true })) as StoredSession[];

/**
 * @function listSessionRows
 * @param userId {string} the signed-in user's id
 * @param currentId {string} the id of the session this request carries
 * @returns {Promise<SessionRow[]>} their unexpired sessions, this one first, then most recently
 *          active first
 */
export const listSessionRows = async (userId: string, currentId: string): Promise<SessionRow[]> =>
  (await activeSessions(userId))
    .toSorted(
      (a, b) =>
        Number(b.id === currentId) - Number(a.id === currentId) ||
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .map((session) => ({
      id: session.id,
      current: session.id === currentId,
      device: describeDevice(session.userAgent),
      signedIn: formatSessionDay(session.createdAt),
      lastActive: formatSessionDay(session.updatedAt),
    }));

/**
 * @function revokeSession
 * @param userId {string} the signed-in user's id
 * @param sessionId {string} one of their sessions
 * @returns {Promise<boolean>} true once it's gone; false when it isn't one of theirs (or already
 *          gone)
 */
export const revokeSession = async (userId: string, sessionId: string): Promise<boolean> => {
  const target = (await activeSessions(userId)).find((session) => session.id === sessionId);
  if (!target) return false;
  await (await adapter()).deleteSession(target.token);
  return true;
};

/**
 * @function revokeOtherSessions
 * @param userId {string} the signed-in user's id
 * @param currentId {string} the session to keep (this request's)
 * @returns {Promise<number>} how many sessions were signed out
 */
export const revokeOtherSessions = async (userId: string, currentId: string): Promise<number> => {
  const tokens = (await activeSessions(userId))
    .filter((session) => session.id !== currentId)
    .map((session) => session.token);
  if (tokens.length > 0) await (await adapter()).deleteSessions(tokens);
  return tokens.length;
};

/**
 * @function deleteIdentity
 * @param userId {string} the signed-in user's id
 * @returns {Promise<void>} once their sessions, osu! link and identity user are gone
 */
export const deleteIdentity = async (userId: string): Promise<void> => {
  await (await adapter()).deleteUser(userId);
};
