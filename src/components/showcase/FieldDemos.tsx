/**
 * @file src/components/showcase/FieldDemos.tsx
 * @desc The text field demos at the top of /ui's Forms group: TextInput, Textarea and Select,
 *       each with a hint, then with a hint and an error, and TextInput with a hidden label.
 *       Server-rendered.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Sep 28, 2026
 * @modified Sun Oct 4, 2026
 */

import { Select, Textarea, TextInput } from "@haruhimemoe/ui";
import { Demo } from "@/components/showcase/Demo";

/**
 * @function FieldDemos
 * @returns {JSX.Element} the TextInput, Textarea and Select demos
 */
export function FieldDemos() {
  return (
    <>
      <Demo
        name="TextInput"
        note="With a hint, then with a hint and an error, then with hideLabel, where the label is only for screen readers."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            id="ui-name"
            label="Pack name"
            hint="Shown on the pack page."
            placeholder="Weekly pool"
          />
          <TextInput
            id="ui-link"
            label="Link name"
            hint="Letters, numbers and dashes."
            defaultValue="my pack!"
            error="Use letters, numbers and dashes only."
          />
          <TextInput
            id="ui-hidden-label"
            label="Search pools"
            hideLabel
            placeholder="Search pools"
          />
        </div>
      </Demo>

      <Demo name="Textarea" note="With a hint, then with a hint and an error.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Textarea id="ui-notes" label="Notes" hint="Anyone with the link can read these." />
          <Textarea
            id="ui-ids"
            label="Beatmap ids"
            hint="One per line."
            defaultValue="abc"
            error="abc isn't a beatmap id."
          />
        </div>
      </Demo>

      <Demo name="Select" note="With a hint, then with a hint and an error.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Select id="ui-mode" label="Game mode" hint="Which ruleset the pool is for.">
            <option value="osu">osu!</option>
            <option value="taiko">taiko</option>
            <option value="fruits">catch</option>
            <option value="mania">mania</option>
          </Select>
          <Select
            id="ui-sort"
            label="Sort by"
            hint="How the list is ordered."
            defaultValue=""
            error="Pick an order."
          >
            <option value="">Choose one</option>
            <option value="stars">Star rating</option>
            <option value="length">Length</option>
          </Select>
        </div>
      </Demo>
    </>
  );
}
