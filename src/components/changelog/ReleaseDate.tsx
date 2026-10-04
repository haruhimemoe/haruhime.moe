/**
 * @file src/components/changelog/ReleaseDate.tsx
 * @desc A release's date under its title: a <time> in words, or "No date" when the changelog
 *       didn't give a real one.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Sun Oct 4, 2026
 */

import { Text, textClasses } from "@haruhimemoe/ui";
import { formatIsoDate } from "@/utils/date";

/**
 * @function ReleaseDate
 * @param props {{ date: string | null }} a YYYY-MM-DD date, or null
 * @returns {JSX.Element} the date as a <time>, or "No date"
 */
export function ReleaseDate({ date }: { date: string | null }) {
  if (!date)
    return (
      <Text as="span" tone="muted">
        No date
      </Text>
    );
  return (
    <time dateTime={date} className={textClasses({ tone: "muted" })}>
      {formatIsoDate(date)}
    </time>
  );
}
