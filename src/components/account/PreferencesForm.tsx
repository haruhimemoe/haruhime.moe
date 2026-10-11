/**
 * @file src/components/account/PreferencesForm.tsx
 * @desc /account's "Time display": a time zone Select ("Use my browser's" first, then every IANA
 *       zone Intl knows) and an hour-cycle RadioGroup (Browser default / 12-hour / 24-hour), a
 *       live preview rendered with next-kit's formatInstant, and Save (POST
 *       /api/account/preferences). Before mount the preview renders UTC at 24-hour so the
 *       server and the first client render match exactly; after mount it switches to the
 *       browser's own zone and, for "Browser default", lets the locale pick the hour cycle
 *       (formatInstant then leaves hourCycle out of Intl's options entirely).
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 11, 2026
 * @modified Sun Oct 11, 2026
 */

"use client";

import { formatInstant, type Preferences } from "@haruhimemoe/next-kit/preferences";
import { AsyncButton, RadioGroup, Select, Text } from "@haruhimemoe/ui";
import { useEffect, useState } from "react";

type HourCycleChoice = "" | "h12" | "h23";

const HOUR_CYCLE_OPTIONS: ReadonlyArray<{ value: HourCycleChoice; label: string }> = [
  { value: "", label: "Browser default" },
  { value: "h12", label: "12-hour" },
  { value: "h23", label: "24-hour" },
];

const TIME_ZONES = Intl.supportedValuesOf("timeZone");

/** PreferencesForm's props. */
export type PreferencesFormProps = {
  /** The signed-in user's stored preferences (defaults when they've set none). */
  initial: Preferences;
  /** Swapped out in tests; defaults to the global fetch. */
  fetcher?: typeof fetch;
};

/**
 * @function PreferencesForm
 * @param props {PreferencesFormProps} the stored preferences and an optional fetcher
 * @returns {JSX.Element} the time zone and hour-cycle controls, a preview line and Save
 */
export function PreferencesForm({ initial, fetcher = fetch }: PreferencesFormProps) {
  const [timezone, setTimezone] = useState(initial.timezone ?? "");
  const [hourCycle, setHourCycle] = useState<HourCycleChoice>(initial.hourCycle ?? "");
  const [mounted, setMounted] = useState(false);
  const [browserZone, setBrowserZone] = useState("UTC");

  useEffect(() => {
    setBrowserZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    setMounted(true);
  }, []);

  const resolvedZone = timezone || (mounted ? browserZone : "UTC");
  const resolvedHourCycle: "h12" | "h23" | null =
    hourCycle === "" ? (mounted ? null : "h23") : hourCycle;
  const preview = formatInstant(new Date().toISOString(), {
    timeZone: resolvedZone,
    hourCycle: resolvedHourCycle,
  });

  return (
    <div className="flex flex-col coarse:gap-6 gap-4">
      <Select
        id="preferences-timezone"
        label="Time zone"
        value={timezone}
        onChange={(event) => setTimezone(event.target.value)}
      >
        <option value="">Use my browser's</option>
        {TIME_ZONES.map((zone) => (
          <option key={zone} value={zone}>
            {zone}
          </option>
        ))}
      </Select>
      <RadioGroup
        label="Hour format"
        options={HOUR_CYCLE_OPTIONS}
        value={hourCycle}
        onChange={(value) => setHourCycle(value as HourCycleChoice)}
      />
      <Text tone="muted">Preview: {preview}</Text>
      <AsyncButton
        failedMessage="Couldn't save. Try again."
        action={async () => {
          const res = await fetcher("/api/account/preferences", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              timezone: timezone || null,
              hourCycle: hourCycle || null,
            }),
          });
          if (!res.ok) throw new Error(String(res.status));
          return "Saved.";
        }}
      >
        Save
      </AsyncButton>
    </div>
  );
}
