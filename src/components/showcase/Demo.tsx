/**
 * @file src/components/showcase/Demo.tsx
 * @desc One component on /ui: its name as an h3, a line on what it is, and the live example in a
 *       bordered box (a border, not a panel, so Card and FilterPanel's own b4 still shows).
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

import type { ReactNode } from "react";

type DemoProps = {
  /** The export's name, as imported from @haruhimemoe/ui. */
  name: string;
  /** One line on what it is or which states the example shows. */
  note: ReactNode;
  /** The live example. Left out for components this page already uses (the shell). */
  children?: ReactNode;
};

/**
 * @function Demo
 * @param props {DemoProps} the component's name, a note, and the example
 * @returns {JSX.Element} the heading, the note, and the example box when there is one
 */
export function Demo({ name, note, children }: DemoProps) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="font-bold text-c1 text-lg">{name}</h3>
        <p className="text-c3 text-sm">{note}</p>
      </div>
      {children ? (
        <div className="flex flex-col gap-4 rounded-[10px] border border-b4 p-5">{children}</div>
      ) : null}
    </div>
  );
}
