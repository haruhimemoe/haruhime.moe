/**
 * @file src/components/showcase/UtilityDemos.tsx
 * @desc /ui's Utilities group: cx, the class merger, run on real input and shown in a
 *       highlighted CodeBlock; useMotionAllowed (MotionDemo, the one client piece); and JsonLd,
 *       which this page uses for its own structured data. Server-rendered.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Sep 28, 2026
 * @modified Sun Oct 4, 2026
 */

import { cx } from "@haruhimemoe/ui";
import { CodeBlock } from "@haruhimemoe/ui/mdx";
import { Demo } from "@/components/showcase/Demo";
import { MotionDemo } from "@/components/showcase/MotionDemo";

const CX_INPUT = `cx("px-2 text-c3", false, "text-h1")`;

/**
 * @function UtilityDemos
 * @returns {JSX.Element} the cx, useMotionAllowed and JsonLd demos
 */
export function UtilityDemos() {
  return (
    <>
      <Demo
        name="cx"
        note="Joins classes, skips falsy ones, and lets a later Tailwind class win a conflict: the components use it to merge your className."
      >
        <CodeBlock
          code={`${CX_INPUT}\n// "${cx("px-2 text-c3", false, "text-h1")}"`}
          lang="ts"
          title="Example"
        />
      </Demo>
      <Demo
        name="useMotionAllowed"
        note="True when the visitor allows motion; false on the server and under reduced motion. The homepage's skyline video plays only when it says so. Change your system's reduce-motion setting and this line follows."
      >
        <MotionDemo />
      </Demo>
      <Demo
        name="JsonLd"
        note="schema.org data in a script tag, so nothing shows. This page carries one describing the package; view the page source to see it."
      />
    </>
  );
}
