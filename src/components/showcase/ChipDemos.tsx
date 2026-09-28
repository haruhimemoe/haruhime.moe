/**
 * @file src/components/showcase/ChipDemos.tsx
 * @desc /ui's chip demos, first in the Filters group: Chip (on, off, disabled, and blocked with a
 *       reason), ChipGroup and ChoiceChips. A client component because the chips take callbacks
 *       and hold state.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Sep 28, 2026
 * @modified Mon Sep 28, 2026
 */

"use client";

import {
  Chip,
  ChipGroup,
  type ChipOption,
  type ChoiceChipOption,
  ChoiceChips,
} from "@haruhimemoe/ui";
import { useState } from "react";
import { Demo } from "@/components/showcase/Demo";

const MODS: ChipOption[] = [
  { value: "HD", label: "HD" },
  { value: "HR", label: "HR" },
  { value: "DT", label: "DT" },
  { value: "FL", label: "FL", unavailableReason: "No FL star ratings from the mirror yet." },
  { value: "EZ", label: "EZ", disabled: true },
];

const MODES: ChipOption[] = [
  { value: "osu", label: "osu!" },
  { value: "taiko", label: "taiko" },
  { value: "fruits", label: "catch" },
  { value: "mania", label: "mania" },
];

const SORTS: ChoiceChipOption[] = [
  { value: "newest", label: "Newest" },
  { value: "stars", label: "Star rating" },
  { value: "length", label: "Length" },
  { value: "played", label: "Most played", disabled: true },
];

/**
 * @function ChipDemos
 * @returns {JSX.Element} the Chip, ChipGroup and ChoiceChips examples
 */
export function ChipDemos() {
  const [loved, setLoved] = useState(true);
  const [mods, setMods] = useState<string[]>(["HD", "DT"]);
  const [sort, setSort] = useState("newest");

  return (
    <>
      <Demo
        name="Chip"
        note="A toggle pill with aria-pressed: on, off after a click, disabled, and blocked with a reason (still focusable, the reason read as its description)."
      >
        <div className="flex flex-wrap items-center gap-2">
          <Chip pressed={loved} onPressedChange={setLoved}>
            Loved
          </Chip>
          <Chip pressed={false} disabled>
            Qualified
          </Chip>
          <Chip pressed={false} unavailableReason="This search has no graveyard maps yet.">
            Graveyard
          </Chip>
        </div>
      </Demo>

      <Demo
        name="ChipGroup"
        note="Chips for picking several values. FL is blocked with a reason and EZ is disabled; the second group is disabled as a whole."
      >
        <ChipGroup label="Mods" options={MODS} value={mods} onChange={setMods} />
        <p className="text-c4 text-xs">Picked: {mods.length > 0 ? mods.join(", ") : "none"}</p>
        <ChipGroup label="Game mode" options={MODES} value={["osu"]} onChange={() => {}} disabled />
      </Demo>

      <Demo
        name="ChoiceChips"
        note="Chips for picking one value, as native radios: arrow keys move and pick. Most played is disabled."
      >
        <ChoiceChips label="Order" options={SORTS} value={sort} onChange={setSort} />
        <p className="text-c4 text-xs">Order: {sort}</p>
      </Demo>
    </>
  );
}
