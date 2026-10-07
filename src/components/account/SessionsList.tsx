/**
 * @file src/components/account/SessionsList.tsx
 * @desc /account "Where you're signed in" card: every unexpired session of the account (this one
 *       first, marked "This device"), each with its browser and system, when it signed in and
 *       when it was last active. Another session gets "Sign out", and "Sign out everywhere else"
 *       ends them all at once; both ask first with @haruhimemoe/ui's InlineConfirm. The outcome
 *       is announced in a polite live region, a failure in an error notice.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

"use client";

import { Card, cx, InlineConfirm, Notice, textClasses } from "@haruhimemoe/ui";
import { useRef, useState } from "react";
import type { SessionRow } from "@/lib/sessions";

const PATH = "/api/account/sessions";

type SessionsListProps = {
  initial: readonly SessionRow[];
  /** fetch, replaced in tests. */
  fetcher?: typeof fetch;
};

const messageOf = async (response: Response): Promise<string> => {
  const fallback = `That didn't work (${response.status}).`;
  try {
    const body = (await response.json()) as { error?: { message?: string } };
    return body.error?.message ?? fallback;
  } catch {
    return fallback;
  }
};

/**
 * @function SessionsList
 * @param props {SessionsListProps} the account's sessions, and a fetch seam
 * @returns {JSX.Element} the sessions card
 */
export function SessionsList({ initial, fetcher = fetch }: SessionsListProps) {
  const [sessions, setSessions] = useState<readonly SessionRow[]>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const inFlightRef = useRef(false);

  /** Runs one call at a time; a failure sets the error and rejects, so a confirm stays open. */
  const run = async (path: string, done: () => void) => {
    // `busy` disables buttons only after a render; two clicks in one frame must not both run.
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setBusy(true);
    setError(null);
    try {
      let response: Response;
      try {
        response = await fetcher(path, { method: "DELETE" });
      } catch {
        response = new Response(null, { status: 503 });
      }
      // 404: already gone, which is what was asked for.
      if (!response.ok && response.status !== 404) {
        const message = await messageOf(response);
        setError(message);
        throw new Error(message);
      }
      done();
    } finally {
      inFlightRef.current = false;
      setBusy(false);
    }
  };

  const revoke = (id: string) =>
    run(`${PATH}/${encodeURIComponent(id)}`, () => {
      setSessions((list) => list.filter((session) => session.id !== id));
      setStatus("Signed out of that device.");
    });

  const revokeOthers = () =>
    run(PATH, () => {
      setSessions((list) => list.filter((session) => session.current));
      setStatus("Signed out everywhere else.");
    });

  const others = sessions.filter((session) => !session.current).length;

  return (
    <Card title="Where you're signed in">
      <ul className="flex flex-col divide-y divide-b3">
        {sessions.map((session) => (
          <li
            key={session.id}
            className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0"
          >
            <div className="flex flex-col">
              <span className="font-bold text-c1">
                {session.device}
                {session.current ? <span className="ml-2 text-h1 text-sm">This device</span> : null}
              </span>
              <span className={textClasses({ tone: "muted", size: "sm" })}>
                Signed in {session.signedIn}, last active {session.lastActive}
              </span>
            </div>
            {session.current ? null : (
              <InlineConfirm
                trigger="Sign out"
                triggerProps={{ variant: "ghost", disabled: busy }}
                question={`Sign out ${session.device}?`}
                cancelLabel="Keep it"
                confirmLabel="Yes, sign out"
                confirmVariant="danger"
                onConfirm={() => revoke(session.id)}
              />
            )}
          </li>
        ))}
      </ul>
      {others > 0 ? (
        <div className="mt-4">
          <InlineConfirm
            trigger="Sign out everywhere else"
            triggerProps={{ variant: "secondary", disabled: busy }}
            question="Every other device is signed out of packs, pools, bb and this site."
            cancelLabel="Keep them"
            confirmLabel="Yes, sign them out"
            confirmVariant="danger"
            onConfirm={revokeOthers}
          />
        </div>
      ) : null}
      <output aria-live="polite" className={cx("mt-2 block", textClasses({ tone: "muted" }))}>
        {status}
      </output>
      {error ? (
        <Notice tone="error" live className="font-bold">
          {error}
        </Notice>
      ) : null}
    </Card>
  );
}
