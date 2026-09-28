/**
 * @file src/components/showcase/OsuDemos.tsx
 * @desc /ui's osu! group: StarRating across osu!'s star spectrum, BeatmapStats from plain numbers,
 *       and ModBadge for every slot bucket. Server-rendered.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Sep 28, 2026
 * @modified Mon Sep 28, 2026
 */

import { BeatmapStats, ModBadge, StarRating } from "@haruhimemoe/ui";
import { Demo } from "@/components/showcase/Demo";

const STARS = [1.8, 3.2, 4.6, 5.9, 6.8, 8.1] as const;
const MODS = ["NM", "HD", "HR", "DT", "FM", "TB", "EZ", "HT", "FL"] as const;

/**
 * @function OsuDemos
 * @returns {JSX.Element} the StarRating, BeatmapStats and ModBadge demos
 */
export function OsuDemos() {
  return (
    <>
      <Demo
        name="StarRating"
        note="A pill on osu!'s star-rating spectrum, from an easy map to a hard one. Screen readers hear the number and the unit (5.90 stars)."
      >
        <div className="flex flex-wrap items-center gap-2">
          {STARS.map((value) => (
            <StarRating key={value} value={value} />
          ))}
        </div>
      </Demo>

      <Demo
        name="BeatmapStats"
        note="CS, AR, OD, HP, BPM and length from plain numbers, as a description list. The second leaves out what it doesn't know."
      >
        <BeatmapStats cs={4} ar={9.3} od={8.5} hp={5} bpm={180} lengthSeconds={128} />
        <BeatmapStats ar={10.33} od={10} bpm={270} lengthSeconds={88} />
      </Demo>

      <Demo name="ModBadge" note="A slot pill, colored by its mod bucket.">
        <div className="flex flex-wrap items-center gap-2">
          {MODS.map((mod) => (
            <ModBadge key={mod} mod={mod} />
          ))}
        </div>
      </Demo>
    </>
  );
}
