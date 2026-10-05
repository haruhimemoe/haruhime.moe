/**
 * @file src/components/showcase/SegmentedDemo.tsx
 * @desc /ui's SegmentedControl demo: a md "View" switch (List, Grid) and an sm hideLabel
 *       "Preview size" switch (Fit, Actual size). A client component because SegmentedControl
 *       takes a value and onChange.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Oct 5, 2026
 * @modified Mon Oct 5, 2026
 */

"use client";

import { SegmentedControl } from "@haruhimemoe/ui";
import { useState } from "react";
import { Demo } from "@/components/showcase/Demo";

const VIEWS = [
  { value: "list", label: "List" },
  { value: "grid", label: "Grid" },
] as const;

const SIZES = [
  { value: "fit", label: "Fit" },
  { value: "actual", label: "Actual size" },
] as const;

/**
 * @function SegmentedDemo
 * @returns {JSX.Element} the SegmentedControl demo
 */
export function SegmentedDemo() {
  const [view, setView] = useState<(typeof VIEWS)[number]["value"]>("list");
  const [size, setSize] = useState<(typeof SIZES)[number]["value"]>("fit");
  return (
    <Demo
      name="SegmentedControl"
      note="A two to four way view switch built on native radios: Tab lands on the checked one."
    >
      <SegmentedControl label="View" options={VIEWS} value={view} onChange={setView} />
      <SegmentedControl
        label="Preview size"
        hideLabel
        size="sm"
        options={SIZES}
        value={size}
        onChange={setSize}
      />
    </Demo>
  );
}
