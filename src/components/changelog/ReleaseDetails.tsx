/**
 * @file src/components/changelog/ReleaseDetails.tsx
 * @desc One release as a closable card: a native <details> whose whole <summary> row (the
 *       caller's title line plus a chevron that turns when open) is the toggle, and the notes
 *       below it. No client JavaScript: the browser opens and closes it, and find in page opens
 *       a closed one.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { ChevronDownIcon, surfaceClasses } from "@haruhimemoe/ui";
import type { ReactNode } from "react";

/** ReleaseDetails' props. */
export type ReleaseDetailsProps = {
  /** The summary row's content: what the release is. The chevron is added after it. */
  summary: ReactNode;
  /** Whether it starts open. */
  open: boolean;
  /** The anchor id, on the <details> so a link scrolls to the row. */
  id?: string | undefined;
  /** The notes. */
  children: ReactNode;
};

/**
 * @function ReleaseDetails
 * @param props {ReleaseDetailsProps} the summary row, whether it starts open, an optional anchor
 *   id, and the notes
 * @returns {JSX.Element} the release card
 */
export function ReleaseDetails({ summary, open, id, children }: ReleaseDetailsProps) {
  return (
    <details
      id={id}
      open={open}
      className={surfaceClasses({ className: "group scroll-mt-20 p-0" })}
    >
      <summary className="flex coarse:min-h-11 cursor-pointer list-none items-center gap-3 rounded-[10px] px-4 py-3 hover:bg-b3 [&::-webkit-details-marker]:hidden">
        <span className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1">
          {summary}
        </span>
        <ChevronDownIcon className="size-5 shrink-0 text-c3 transition-transform group-open:rotate-180 motion-reduce:transition-none" />
      </summary>
      <div className="border-b3 border-t px-4 pt-4 pb-5">{children}</div>
    </details>
  );
}
