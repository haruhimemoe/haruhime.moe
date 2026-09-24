/**
 * @file src/components/showcase/DemoGroup.tsx
 * @desc One group of components on /ui (Basics, Forms, ...): an h2 with an anchor id, then its
 *       demos.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

import type { ReactNode } from "react";

type DemoGroupProps = {
  /** The anchor id, also used by the page's "On this page" links. */
  id: string;
  title: string;
  children: ReactNode;
};

/**
 * @function DemoGroup
 * @param props {DemoGroupProps} the anchor id, the group's title, and its demos
 * @returns {JSX.Element} a section named by its h2
 */
export function DemoGroup({ id, title, children }: DemoGroupProps) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-8">
      <h2 id={id} className="border-b4 border-b pb-2 font-bold text-2xl text-c1">
        {title}
      </h2>
      {children}
    </section>
  );
}
