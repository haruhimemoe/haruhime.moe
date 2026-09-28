/**
 * @file src/components/showcase/FormDemos.tsx
 * @desc /ui's Forms group: the text fields (FieldDemos), then Checkbox, RadioGroup and
 *       fieldClasses. Server-rendered; RadioGroup runs uncontrolled with its own client code.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Sep 28, 2026
 * @modified Mon Sep 28, 2026
 */

import { Checkbox, fieldClasses, RadioGroup, type RadioOption } from "@haruhimemoe/ui";
import { Demo } from "@/components/showcase/Demo";
import { FieldDemos } from "@/components/showcase/FieldDemos";

const VISIBILITY: readonly RadioOption[] = [
  { value: "private", label: "Private", hint: "Only you and your editors." },
  { value: "unlisted", label: "Unlisted", hint: "Anyone with the link." },
  { value: "public", label: "Public", hint: "Listed in search." },
];

const DOWNLOAD: readonly RadioOption[] = [
  { value: "zip", label: "One zip" },
  { value: "torrent", label: "Torrent", disabled: true, hint: "For packs over 2 GB." },
];

/**
 * @function FormDemos
 * @returns {JSX.Element} the Forms group's demos, text fields first
 */
export function FormDemos() {
  return (
    <>
      <FieldDemos />
      <Demo name="Checkbox" note="With a hint, then with a hint and an error.">
        <Checkbox
          id="ui-public"
          label="Public"
          hint="Anyone with the link can see it."
          defaultChecked
        />
        <Checkbox
          id="ui-rules"
          label="I read the rules"
          hint="The mappool rules for this tournament."
          error="Check this box to go on."
        />
      </Demo>

      <Demo
        name="RadioGroup"
        note="Native radios in a fieldset, on the Checkbox look: per-option hints, then a disabled option and a group error."
      >
        <RadioGroup
          label="Who can see it"
          name="ui-visibility"
          options={VISIBILITY}
          defaultValue="unlisted"
          hint="You can change this later."
        />
        <RadioGroup
          label="Download as"
          name="ui-download"
          options={DOWNLOAD}
          error="Pick how to download the pack."
        />
      </Demo>

      <Demo
        name="fieldClasses"
        note="The field look as a string, for a bare control that labels itself."
      >
        <select aria-label="Move to" defaultValue="nm" className={fieldClasses("w-auto")}>
          <option value="nm">Move to NM</option>
          <option value="hd">Move to HD</option>
          <option value="dt">Move to DT</option>
        </select>
      </Demo>
    </>
  );
}
