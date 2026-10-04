/**
 * @file src/components/showcase/MotionDemo.tsx
 * @desc /ui's useMotionAllowed demo: one line saying whether the visitor's browser allows motion
 *       or asks for reduced motion, following the setting live. A client component because the
 *       hook reads the browser's media query after hydration.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Sun Oct 4, 2026
 */

"use client";

import { useMotionAllowed } from "@haruhimemoe/ui";

/**
 * @function MotionDemo
 * @returns {JSX.Element} a line saying whether motion is allowed or reduced
 */
export function MotionDemo() {
  return (
    <p className="text-c2 text-sm">
      {useMotionAllowed() ? "Your browser allows motion." : "Your browser asks for reduced motion."}
    </p>
  );
}
