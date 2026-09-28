/**
 * @file src/components/showcase/BasicsDemos.tsx
 * @desc /ui's Basics group: the buttons (ButtonDemos), Card, Badge, Notice and Disclosure, each
 *       in its states. Renders on the server; Disclosure brings its own client code.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Sep 28, 2026
 * @modified Mon Sep 28, 2026
 */

import { Badge, Card, Disclosure, Notice } from "@haruhimemoe/ui";
import { ButtonDemos } from "@/components/showcase/ButtonDemos";
import { Demo } from "@/components/showcase/Demo";

/**
 * @function BasicsDemos
 * @returns {JSX.Element} the Basics group's demos, buttons first
 */
export function BasicsDemos() {
  return (
    <>
      <ButtonDemos />
      <Demo
        name="Card"
        note="The panel, without and with a title. A title makes it a region. Its heading is an h2 unless headingLevel says otherwise."
      >
        <Card>A card without a title. Just a rounded b4 panel.</Card>
        <Card title="A card with a title" headingLevel={4}>
          <p className="text-sm">
            The title names the card. It's an h4 here (headingLevel 4), under this demo's h3.
          </p>
        </Card>
      </Demo>

      <Demo
        name="Badge"
        note="A small pill for a status or tag: neutral, accent, warning and muted."
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge>ranked</Badge>
          <Badge tone="accent">new</Badge>
          <Badge tone="warning">check first</Badge>
          <Badge tone="muted">beta</Badge>
        </div>
      </Demo>

      <Demo name="Notice" note="Short status text in each tone, then an error list as a div.">
        <Notice>Info: the pack is saved in this browser.</Notice>
        <Notice tone="warning">Warning: two maps in this pool are loved, not ranked.</Notice>
        <Notice tone="error">Error: that beatmap set doesn't exist.</Notice>
        <Notice tone="error" as="div">
          <p>Two maps couldn't be added:</p>
          <ul className="list-disc pl-5">
            <li>1234567 isn't a beatmap id.</li>
            <li>7654321 is already in the pack.</li>
          </ul>
        </Notice>
      </Demo>

      <Demo
        name="Disclosure"
        note="A button that shows and hides a panel, with aria-expanded. Closed, then open by default."
      >
        <Disclosure summary="Download options">
          <p className="text-sm">One zip, or a torrent for big packs.</p>
        </Disclosure>
        <Disclosure summary="Rules for this pool" defaultOpen>
          <p className="text-sm">Ranked and loved maps only, no more than one map per mapper.</p>
        </Disclosure>
      </Demo>
    </>
  );
}
