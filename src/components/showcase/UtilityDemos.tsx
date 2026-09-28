/**
 * @file src/components/showcase/UtilityDemos.tsx
 * @desc /ui's Utilities group: cx, the class merger, run on real input, and JsonLd, which this page
 *       uses for its own structured data. Server-rendered.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Sep 28, 2026
 * @modified Mon Sep 28, 2026
 */

import { cx } from "@haruhimemoe/ui";
import { Demo } from "@/components/showcase/Demo";

const CX_INPUT = `cx("rounded-md px-2 text-c3", false, "text-h1")`;

/**
 * @function UtilityDemos
 * @returns {JSX.Element} the cx and JsonLd demos
 */
export function UtilityDemos() {
  return (
    <>
      <Demo
        name="cx"
        note="Joins classes, skips falsy ones, and lets a later Tailwind class win a conflict: the components use it to merge your className."
      >
        <pre className="overflow-x-auto rounded-md bg-b5 p-3 text-c2 text-sm">
          <code>
            {CX_INPUT}
            {"\n"}
            {`// "${cx("rounded-md px-2 text-c3", false, "text-h1")}"`}
          </code>
        </pre>
      </Demo>
      <Demo
        name="JsonLd"
        note="schema.org data in a script tag, so nothing shows. This page carries one describing the package; view the page source to see it."
      />
    </>
  );
}
