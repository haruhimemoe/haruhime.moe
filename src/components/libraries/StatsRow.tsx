/**
 * @file src/components/libraries/StatsRow.tsx
 * @desc A library's numbers in one row: version, downloads last month, GitHub stars and the
 *       latest release, as a description list so each number keeps its label. A number whose
 *       lookup failed shows a dash.
 * @author David @dvhsh (https://dvh.sh)
 * @created Fri Oct 2, 2026
 * @modified Fri Oct 2, 2026
 */

import { cx } from "@haruhimemoe/ui";
import type { LibraryStats } from "@/lib/libraries/stats";
import { formatCount, formatRelease, MISSING } from "@/utils/libraries-format";

/**
 * @function StatsRow
 * @param props {{ stats: LibraryStats; className?: string }} the library's stats
 * @returns {JSX.Element} a `<dl>` of the four stats
 */
export function StatsRow({ stats, className }: { stats: LibraryStats; className?: string }) {
  const items: readonly [string, string][] = [
    ["Version", stats.version ?? MISSING],
    ["Downloads / month", formatCount(stats.downloads)],
    ["Stars", formatCount(stats.stars)],
    ["Latest release", formatRelease(stats.release)],
  ];
  return (
    <dl className={cx("flex flex-wrap gap-x-6 gap-y-2 text-sm", className)}>
      {items.map(([label, value]) => (
        <div key={label} className="flex flex-col">
          <dt className="text-c4 text-xs uppercase tracking-wide">{label}</dt>
          <dd className="font-bold text-c1 tabular-nums">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
