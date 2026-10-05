/**
 * @file src/components/showcase/OsuDemos.tsx
 * @desc /ui's osu! group: StarRating across osu!'s star spectrum, BeatmapStats from plain numbers,
 *       ModBadge for every slot bucket and every color, PlayerCard (sample data: offline, online
 *       and name-only), and the map display demos (MapDemos). Server-rendered.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Sep 28, 2026
 * @modified Mon Oct 5, 2026
 */

import {
  BeatmapStats,
  ModBadge,
  type ModBadgeColor,
  PlayerCard,
  StarRating,
} from "@haruhimemoe/ui";
import { Demo } from "@/components/showcase/Demo";
import { MapDemos } from "@/components/showcase/MapDemos";

const STARS = [1.8, 3.2, 4.6, 5.9, 6.8, 8.1] as const;
const MODS = ["NM", "HD", "HR", "DT", "FM", "TB", "EZ", "HT", "FL"] as const;

/** Every color a custom slot bucket can take through ModBadge's color prop. */
const COLORS: readonly ModBadgeColor[] = [
  "sky",
  "amber",
  "rose",
  "violet",
  "emerald",
  "orange",
  "green",
  "teal",
  "pink",
  "lime",
  "cyan",
  "fuchsia",
  "yellow",
  "red",
  "indigo",
  "stone",
  "neutral",
];

/** peppy's public profile as of Oct 4, 2026: the sample player. */
const PEPPY = {
  username: "peppy",
  userId: 2,
  countryCode: "AU",
  coverUrl:
    "https://assets.ppy.sh/user-profile-covers/2/baba245ef60834b769694178f8f6d4f6166c5188c740de084656ad2b80f1eea7.jpeg",
  team: {
    name: "mom?",
    flagUrl:
      "https://assets.ppy.sh/teams/flag/1/b46fb10dbfd8a35dc50e6c00296c0dc6172dffc3ed3d3a4b379277ba498399fe.png",
  },
  supporter: true,
} as const;

/**
 * @function OsuDemos
 * @returns {JSX.Element} the StarRating, BeatmapStats, ModBadge, PlayerCard and map display demos
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

      <Demo
        name="ModBadge"
        note="A slot pill, colored by its mod bucket, then all 17 colors a custom bucket can take with color."
      >
        <div className="flex flex-wrap items-center gap-2">
          {MODS.map((mod) => (
            <ModBadge key={mod} mod={mod} />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {COLORS.map((color) => (
            <ModBadge key={color} mod="C1" color={color}>
              {color}
            </ModBadge>
          ))}
        </div>
      </Demo>

      <Demo
        name="PlayerCard"
        note="osu!-web's user card from a snapshot: cover, avatar, country and team flags, supporter heart, and the whole card links to the profile. It never fetches. The statuses here are sample data; leave status out for static data and the ring goes away."
      >
        <ul className="grid gap-2.5 sm:grid-cols-2">
          <li>
            <PlayerCard {...PEPPY} status="offline" statusNote="Last seen 29 days ago" />
          </li>
          <li>
            <PlayerCard {...PEPPY} status="online" />
          </li>
          <li>
            <PlayerCard {...PEPPY} statusText="osu!" statusNote="a role instead of a status" />
          </li>
          <li>
            <PlayerCard username="sample player" statusText="no account given: name only" />
          </li>
        </ul>
      </Demo>

      <MapDemos />
    </>
  );
}
