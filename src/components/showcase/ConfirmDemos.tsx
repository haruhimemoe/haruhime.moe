/**
 * @file src/components/showcase/ConfirmDemos.tsx
 * @desc /ui's confirm and async action demos: InlineConfirm, AsyncButton (one that works, one that
 *       fails), TypeToConfirm, Dialog and ConfirmDialog, plain and type-to-confirm. A client
 *       component because each takes a callback. Nothing is really deleted or sent: the callbacks
 *       wait a moment and count.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Sep 28, 2026
 * @modified Mon Oct 5, 2026
 */

"use client";

import {
  AsyncButton,
  Button,
  ConfirmDialog,
  Dialog,
  InlineConfirm,
  TypeToConfirm,
} from "@haruhimemoe/ui";
import { useState } from "react";
import { Demo } from "@/components/showcase/Demo";

/** A made-up network wait, so the pending states show. */
const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * @function ConfirmDemos
 * @returns {JSX.Element} the InlineConfirm, AsyncButton, TypeToConfirm, Dialog and ConfirmDialog demos
 */
export function ConfirmDemos() {
  const [deleted, setDeleted] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
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

      <Demo
        name="Dialog"
        note="The modal base: follows an open prop, locks the page's scroll and hands focus back on close. Escape and a press outside ask the owner to close it."
      >
        <Button variant="secondary" onClick={() => setDialogOpen(true)}>
          Open a dialog
        </Button>
        <Dialog
          open={dialogOpen}
          onDismiss={() => setDialogOpen(false)}
          aria-label="A plain dialog"
          className="m-0 h-dvh max-h-none w-full max-w-none open:flex"
        >
          {dialogOpen ? (
            <div className="m-auto flex w-[calc(100%-2rem)] max-w-md flex-col gap-4 rounded-xl border border-b3 bg-b6 p-5">
              <p className="text-c2 text-sm">
                Press Escape, press outside, or use the button. Focus goes back to what opened it.
              </p>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
            </div>
          ) : null}
        </Dialog>
      </Demo>

      <Demo
        name="ConfirmDialog"
        note="A confirm in a dialog, for a delete that affects other people or needs more than a sentence. The second asks for the name first."
      >
        <ConfirmDialog
          trigger="Delete pack"
          title="Delete this pack?"
          description="Its short link stops working for everyone. Pack keys already shared still open the pool."
          tone="destructive"
          confirmLabel="Delete pack"
          pendingLabel="Deleting…"
          onConfirm={deleteOnce}
        />
        <ConfirmDialog
          trigger="Delete Monthly pool"
          triggerProps={{ variant: "danger" }}
          title="Delete Monthly pool?"
          description="This deletes the pool for you and everyone who edits it."
          tone="destructive"
          typeToConfirm="Monthly pool"
          confirmLabel="Delete for good"
          pendingLabel="Deleting…"
          onConfirm={deleteOnce}
        />
      </Demo>
    </>
  );
}
