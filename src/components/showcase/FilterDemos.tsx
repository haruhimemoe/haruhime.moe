/**
 * @file src/components/showcase/FilterDemos.tsx
 * @desc The interactive part of /ui: Chip, ChipGroup, RangeSlider, FilterRow and a FilterPanel
 *       over a sample mappool, with a live result count. A client component because the filters
 *       take callbacks and hold state; the rest of /ui renders on the server.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

"use client";

import {
  Chip,
  ChipGroup,
  type ChipOption,
  FilterPanel,
  FilterRow,
  RangeSlider,
  type RangeSliderValue,
} from "@haruhimemoe/ui";
import { useState } from "react";
import { Demo } from "@/components/showcase/Demo";
import { formatLength, parseLength } from "@/utils/length";

const MODS: ChipOption[] = [
  { value: "HD", label: "HD" },
  { value: "HR", label: "HR" },
  { value: "DT", label: "DT" },
  { value: "FL", label: "FL" },
  { value: "EZ", label: "EZ", disabled: true },
];

const MODES: ChipOption[] = [
  { value: "osu", label: "osu!" },
  { value: "taiko", label: "taiko" },
  { value: "fruits", label: "catch" },
  { value: "mania", label: "mania" },
];

const SLOT_MODS: ChipOption[] = ["NM", "HD", "HR", "DT", "FM", "TB"].map((mod) => ({
  value: mod,
  label: mod,
}));

/** A made-up mappool for the FilterPanel example: slot, mod, star rating, length in seconds. */
const SAMPLE_POOL = [
  { slot: "NM1", mod: "NM", stars: 5.21, length: 128 },
  { slot: "NM2", mod: "NM", stars: 5.48, length: 154 },
  { slot: "NM3", mod: "NM", stars: 5.63, length: 97 },
  { slot: "NM4", mod: "NM", stars: 5.9, length: 201 },
  { slot: "HD1", mod: "HD", stars: 5.35, length: 142 },
  { slot: "HD2", mod: "HD", stars: 5.72, length: 118 },
  { slot: "HR1", mod: "HR", stars: 5.8, length: 133 },
  { slot: "HR2", mod: "HR", stars: 6.12, length: 176 },
  { slot: "DT1", mod: "DT", stars: 6.05, length: 88 },
  { slot: "DT2", mod: "DT", stars: 6.4, length: 104 },
  { slot: "DT3", mod: "DT", stars: 6.77, length: 92 },
  { slot: "FM1", mod: "FM", stars: 5.6, length: 146 },
  { slot: "FM2", mod: "FM", stars: 5.95, length: 163 },
  { slot: "TB", mod: "TB", stars: 7.1, length: 312 },
] as const;

/**
 * @function inRange
 * @param n {number} the value to test
 * @param range {RangeSliderValue} the range; a null top means no upper limit
 * @returns {boolean} whether n sits inside the range
 */
const inRange = (n: number, [low, high]: RangeSliderValue): boolean =>
  n >= low && (high === null || n <= high);

/**
 * @function showRange
 * @param range {RangeSliderValue} a RangeSlider value
 * @returns {string} the value as the component reports it, e.g. "[0, null]"
 */
const showRange = ([low, high]: RangeSliderValue): string => `[${low}, ${high ?? "null"}]`;

/**
 * @function FilterDemos
 * @returns {JSX.Element} the Chip, ChipGroup, RangeSlider, FilterRow and FilterPanel examples
 */
export function FilterDemos() {
  const [loved, setLoved] = useState(true);
  const [mods, setMods] = useState<string[]>(["HD", "DT"]);
  const [stars, setStars] = useState<RangeSliderValue>([0, null]);
  const [length, setLength] = useState<RangeSliderValue>([60, 300]);
  const [mode, setMode] = useState<string[]>(["osu"]);

  const [poolMods, setPoolMods] = useState<string[]>([]);
  const [poolStars, setPoolStars] = useState<RangeSliderValue>([0, null]);
  const [poolLength, setPoolLength] = useState<RangeSliderValue>([0, null]);
  const matches = SAMPLE_POOL.filter(
    (map) =>
      (poolMods.length === 0 || poolMods.includes(map.mod)) &&
      inRange(map.stars, poolStars) &&
      inRange(map.length, poolLength),
  );
  const active =
    poolMods.length > 0 || poolStars[0] > 0 || poolStars[1] !== null || poolLength[0] > 0;

  return (
    <>
      <Demo
        name="Chip"
        note="A toggle pill with aria-pressed: on, off after a click, and disabled."
      >
        <div className="flex flex-wrap items-center gap-2">
          <Chip pressed={loved} onPressedChange={setLoved}>
            Loved
          </Chip>
          <Chip pressed={false} disabled>
            Qualified
          </Chip>
        </div>
      </Demo>

      <Demo
        name="ChipGroup"
        note="Chips for picking several values. EZ is a disabled option; the second group is disabled as a whole."
      >
        <ChipGroup label="Mods" options={MODS} value={mods} onChange={setMods} />
        <p className="text-c4 text-xs">Picked: {mods.length > 0 ? mods.join(", ") : "none"}</p>
        <ChipGroup label="Game mode" options={MODES} value={["osu"]} onChange={() => {}} disabled />
      </Demo>

      <Demo
        name="RangeSlider"
        note="Two thumbs and a box at each end. Star rating is open-ended (10+ means no limit), length reads and writes m:ss, and BPM is disabled."
      >
        <RangeSlider
          label="Star rating"
          min={0}
          max={10}
          step={0.1}
          openEnded
          value={stars}
          onChange={setStars}
        />
        <p className="text-c4 text-xs">Value: {showRange(stars)}</p>
        <RangeSlider
          label="Length"
          min={0}
          max={600}
          step={5}
          format={formatLength}
          parse={parseLength}
          value={length}
          onChange={setLength}
        />
        <p className="text-c4 text-xs">Value in seconds: {showRange(length)}</p>
        <RangeSlider
          label="BPM"
          min={60}
          max={300}
          value={[120, 240]}
          onChange={() => {}}
          disabled
        />
      </Demo>

      <Demo
        name="FilterRow"
        note="One labelled row: the label on the left from sm up, above the controls on phones."
      >
        <FilterRow label="Game mode">
          <ChipGroup label="Game mode" hideLabel options={MODES} value={mode} onChange={setMode} />
        </FilterRow>
      </Demo>

      <Demo
        name="FilterPanel"
        note="Filter rows under a title, with a live result count and Clear filters once a filter is set. On phones the rows fold behind the arrow button."
      >
        <FilterPanel
          title="Sample pool"
          headingLevel={4}
          resultCount={`${matches.length} of ${SAMPLE_POOL.length} slots`}
          active={active}
          onClear={() => {
            setPoolMods([]);
            setPoolStars([0, null]);
            setPoolLength([0, null]);
          }}
        >
          <FilterRow label="Mod">
            <ChipGroup
              label="Mod"
              hideLabel
              options={SLOT_MODS}
              value={poolMods}
              onChange={setPoolMods}
            />
          </FilterRow>
          <FilterRow label="Star rating">
            <RangeSlider
              label="Star rating"
              hideLabel
              min={0}
              max={10}
              step={0.1}
              openEnded
              value={poolStars}
              onChange={setPoolStars}
            />
          </FilterRow>
          <FilterRow label="Length">
            <RangeSlider
              label="Length"
              hideLabel
              min={0}
              max={600}
              step={5}
              openEnded
              format={formatLength}
              parse={parseLength}
              value={poolLength}
              onChange={setPoolLength}
            />
          </FilterRow>
        </FilterPanel>
        <p className="text-c3 text-sm">
          {matches.length > 0
            ? `Matching: ${matches.map((map) => map.slot).join(", ")}`
            : "No slots match."}
        </p>
      </Demo>
    </>
  );
}
