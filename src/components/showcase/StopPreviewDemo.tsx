/**
 * @file src/components/showcase/StopPreviewDemo.tsx
 * @desc /ui's stopMapPreview demo: a button that stops whatever preview clip is playing, the
 *       call an app makes on a route change. Client: it handles a click.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Oct 5, 2026
 * @modified Mon Oct 5, 2026
 */

"use client";

import { Button, stopMapPreview } from "@haruhimemoe/ui";

/**
 * @function StopPreviewDemo
 * @returns {JSX.Element} a secondary button that calls stopMapPreview
 */
export function StopPreviewDemo() {
  return (
    <Button variant="secondary" onClick={() => stopMapPreview()}>
      Stop any preview
    </Button>
  );
}
