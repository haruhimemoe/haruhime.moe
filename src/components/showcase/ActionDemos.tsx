/**
 * @file src/components/showcase/ActionDemos.tsx
 * @desc /ui's Actions group: CopyButton, then the confirm and async demos (ConfirmDemos) and
 *       Pagination (PaginationDemos), which run on the client. The group's anchor is #actions,
 *       which the pagination example links point at.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Sep 28, 2026
 * @modified Mon Sep 28, 2026
 */

import { CopyButton } from "@haruhimemoe/ui";
import { ConfirmDemos } from "@/components/showcase/ConfirmDemos";
import { Demo } from "@/components/showcase/Demo";
import { PaginationDemos } from "@/components/showcase/PaginationDemos";
import { UI_INSTALL } from "@/constants/showcase";
import { SITE } from "@/constants/site";

/**
 * @function ActionDemos
 * @returns {JSX.Element} the Actions group's demos
 */
export function ActionDemos() {
  return (
    <>
      <Demo
        name="CopyButton"
        note="Copies text and says so beside the button. The default, then a primary one with its own label and message."
      >
        <CopyButton text={UI_INSTALL} />
        <CopyButton
          text={`${SITE.url}/ui`}
          label="Copy this page's link"
          copiedMessage="Link copied."
          variant="primary"
        />
      </Demo>
      <ConfirmDemos />
      <PaginationDemos />
    </>
  );
}
