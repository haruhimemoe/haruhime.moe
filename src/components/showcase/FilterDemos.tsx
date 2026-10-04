/**
 * @file src/components/showcase/FilterDemos.tsx
 * @desc /ui's Filters group: the chips (ChipDemos), then RangeSlider, FilterRow and a FilterPanel
 *       over the sample mappool, with a live result count. A client component because the filters
 *       take callbacks and hold state.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Sun Oct 4, 2026
 */

"use client";

import {
  ChipGroup,
  type ChipOption,
  FilterPanel,
  FilterRow,
  RangeSlider,
  type RangeSliderValue,
  Text,
} from "@haruhimemoe/ui";
import { useState } from "react";
import { ChipDemos } from "@/components/showcase/ChipDemos";
import { Demo } from "@/components/showcase/Demo";
import { SAMPLE_POOL } from "@/constants/showcase";
import { formatLength, parseLength } from "@/utils/length";

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
 * @returns {JSX.Element} the chip examples, then the RangeSlider, FilterRow and FilterPanel ones
 */
export function FilterDemos() {
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
    poolMods.length > 0 ||
    poolStars[0] > 0 ||
    poolStars[1] !== null ||
    poolLength[0] > 0 ||
    poolLength[1] !== null;

  return (
    <>
      <ChipDemos />
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
        <Text tone="muted">
          {matches.length > 0
            ? `Matching: ${matches.map((map) => map.slot).join(", ")}`
            : "No slots match."}
        </Text>
      </Demo>
    </>
  );
}
