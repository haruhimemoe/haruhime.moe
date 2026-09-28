/**
 * @file src/components/showcase/TextLimitDemos.tsx
 * @desc /ui's CharCounter and ReportDisclosure demos: a textarea counted live against a small
 *       limit, and a report form whose send waits a moment and then thanks you (nothing is sent).
 *       A client component because both hold state or take callbacks.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Sep 28, 2026
 * @modified Mon Sep 28, 2026
 */

"use client";

import { CharCounter, ReportDisclosure, Textarea } from "@haruhimemoe/ui";
import { useState } from "react";
import { Demo } from "@/components/showcase/Demo";

const LIMIT = 60;

/** A made-up network wait, so the pending state shows. */
const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * @function TextLimitDemos
 * @returns {JSX.Element} the CharCounter and ReportDisclosure demos
 */
export function TextLimitDemos() {
  const [text, setText] = useState("Welcome to the tournament! Read the rules before you sign up.");
  return (
    <>
      <Demo
        name="CharCounter"
        note={`How much of a limit a text uses. Type past ${LIMIT} characters to see it turn rose and say how many to cut.`}
      >
        <Textarea
          id="ui-counter-text"
          label="Post"
          value={text}
          onChange={(event) => setText(event.currentTarget.value)}
          aria-describedby="ui-counter"
        />
        <CharCounter id="ui-counter" count={text.length} limit={LIMIT} />
      </Demo>
      <Demo
        name="ReportDisclosure"
        note="A report reason in a disclosure. The caller sends it and says how it went; here it waits a moment and thanks you."
      >
        <ReportDisclosure
          summary="Report this template"
          maxLength={500}
          onSubmit={async () => {
            await wait(600);
            return { ok: true };
          }}
        />
      </Demo>
    </>
  );
}
