/**
 * @file src/components/showcase/VisibilityDemo.tsx
 * @desc /ui's VisibilitySelect demo: the radios with the default words, then the select with a
 *       site's own words. A client component because the picked value is state.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Sep 28, 2026
 * @modified Mon Sep 28, 2026
 */

"use client";

import { VISIBILITIES, VISIBILITY_TEXT, type Visibility, VisibilitySelect } from "@haruhimemoe/ui";
import { useState } from "react";
import { Demo } from "@/components/showcase/Demo";

/**
 * @function VisibilityDemo
 * @returns {JSX.Element} the VisibilitySelect demo, as radios and as a select, then its constants
 */
export function VisibilityDemo() {
  const [radio, setRadio] = useState<Visibility>("unlisted");
  const [select, setSelect] = useState<Visibility>("private");
  return (
    <>
      <Demo
        name="VisibilitySelect"
        note="Private, unlisted or public with who sees each: as radios with the default words, then as a select with its own words (the picked one's line is the hint)."
      >
        <VisibilitySelect
          id="ui-vis-radio"
          label="Who can see this template"
          value={radio}
          onChange={setRadio}
        />
        <VisibilitySelect
          as="select"
          id="ui-vis-select"
          label="Who can see this pool"
          text={{ private: { hint: "Only you and your editors." } }}
          value={select}
          onChange={setSelect}
          className="max-w-sm"
        />
      </Demo>
      <Demo
        name="VISIBILITIES"
        note={`The three, most closed first: ${VISIBILITIES.join(", ")}.`}
      />
      <Demo
        name="VISIBILITY_TEXT"
        note={`The default words: ${VISIBILITIES.map((value) => VISIBILITY_TEXT[value].label).join(", ")}, each with its line.`}
      />
    </>
  );
}
