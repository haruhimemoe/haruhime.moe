/**
 * @file src/components/showcase/ConfirmDemos.tsx
 * @desc /ui's confirm and async action demos: InlineConfirm, AsyncButton (one that works, one that
 *       fails) and TypeToConfirm. A client component because each takes a callback. Nothing is
 *       really deleted or sent: the callbacks wait a moment and count.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Sep 28, 2026
 * @modified Mon Sep 28, 2026
 */

"use client";

import { AsyncButton, InlineConfirm, TypeToConfirm } from "@haruhimemoe/ui";
import { useState } from "react";
import { Demo } from "@/components/showcase/Demo";

/** A made-up network wait, so the pending states show. */
const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * @function ConfirmDemos
 * @returns {JSX.Element} the InlineConfirm, AsyncButton and TypeToConfirm demos
 */
export function ConfirmDemos() {
  const [deleted, setDeleted] = useState(0);
  const deleteOnce = async (): Promise<void> => {
    await wait(600);
    setDeleted((count) => count + 1);
  };

  return (
    <>
      <Demo
        name="InlineConfirm"
        note="A two-step confirm in the page. Opening it moves focus to the cancel button; cancel or Escape puts it back on the trigger."
      >
        <InlineConfirm
          trigger="Delete pool"
          question="Delete this pool for good?"
          confirmLabel="Yes, delete it"
          cancelLabel="Keep it"
          pendingLabel="Deleting…"
          onConfirm={deleteOnce}
        />
        <p className="text-c4 text-xs">Pretend deletes so far: {deleted}</p>
      </Demo>

      <Demo
        name="AsyncButton"
        note="Runs an async action and says how it went beside the button. The second one fails."
      >
        <AsyncButton
          pendingLabel="Updating…"
          action={async () => {
            await wait(600);
            return "Pack updated.";
          }}
        >
          Update pack now
        </AsyncButton>
        <AsyncButton
          variant="secondary"
          failedMessage="The mirror didn't answer. Try again in a minute."
          action={async () => {
            await wait(600);
            throw new Error("mirror timeout");
          }}
        >
          Retry sync
        </AsyncButton>
      </Demo>

      <Demo
        name="TypeToConfirm"
        note="For what can't be undone: the button stays off until the name is typed exactly."
      >
        <TypeToConfirm
          id="ui-type-to-confirm"
          expected="Weekly pool"
          label="Type Weekly pool to delete it"
          submitLabel="Delete Weekly pool"
          pendingLabel="Deleting…"
          onConfirm={deleteOnce}
        />
      </Demo>
    </>
  );
}
