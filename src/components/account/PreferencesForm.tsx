/**
 * @file src/components/account/PreferencesForm.tsx
 * @desc /account's "Time display": a time zone Select ("Use my browser's" first, then every IANA
 *       zone Intl knows) and an hour-cycle RadioGroup (Default (12-hour) / 12-hour / 24-hour), a
 *       live preview rendered with next-kit's formatInstant, and Save (POST
 *       /api/account/preferences). Intl.supportedValuesOf("timeZone") differs between Node and
 *       the browser's ICU, so it's never read at module scope or during the first render: the
 *       server and the first client render show only "Use my browser's" plus the stored zone
 *       (kept as an option even when it's an alias like Asia/Calcutta that supportedValuesOf
 *       doesn't list, so saving never silently nulls it); a mount effect then fills in the full
 *       list. The preview is also mount-only (a stable placeholder renders before, never
 *       new Date() during the server/first-client render) and, once mounted, switches to the
 *       browser's own zone.
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
  { value: "", label: "Default (12-hour)" },
  { value: "h12", label: "12-hour" },
  { value: "h23", label: "24-hour" },
];

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
  // Before mount, show only the stored zone (if any): Intl.supportedValuesOf("timeZone")
  // differs between Node's ICU and the browser's, so building the full list here would mismatch
  // on hydration.
  const [timeZones, setTimeZones] = useState<readonly string[]>(
    initial.timezone ? [initial.timezone] : [],
  );

  useEffect(() => {
    setBrowserZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    const zones = Intl.supportedValuesOf("timeZone");
    // A stored alias (Asia/Calcutta, say) may not be in supportedValuesOf's list: keep it as an
    // option so saving never silently nulls it.
    setTimeZones(
      initial.timezone && !zones.includes(initial.timezone) ? [initial.timezone, ...zones] : zones,
    );
    setMounted(true);
  }, [initial.timezone]);

  const resolvedZone = timezone || (mounted ? browserZone : "UTC");
  const resolvedHourCycle: "h12" | "h23" | null =
    hourCycle === "" ? (mounted ? null : "h23") : hourCycle;
  // No preview before mount: new Date() during the server/first-client render would mismatch.
  const preview = mounted
    ? formatInstant(new Date().toISOString(), {
        timeZone: resolvedZone,
        hourCycle: resolvedHourCycle,
      })
    : null;

  return (
    <div className="flex flex-col coarse:gap-6 gap-4">
      <Select
        id="preferences-timezone"
        label="Time zone"
        value={timezone}
        onChange={(event) => setTimezone(event.target.value)}
      >
        <option value="">Use my browser's</option>
        {timeZones.map((zone) => (
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
      <Text tone="muted">Preview: {preview ?? "loading"}</Text>
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
