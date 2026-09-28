/**
 * @file src/constants/showcase.ts
 * @desc Data for /ui, the @haruhimemoe/ui showcase: where the package lives, its install command,
 *       and the made-up mappool the filter, table and osu! demos share.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Sep 28, 2026
 * @modified Mon Sep 28, 2026
 */

import { SITE } from "@/constants/site";

/** @haruhimemoe/ui's source on GitHub. */
export const UI_REPO_URL = `${SITE.githubOrg}/ui`;

/** @haruhimemoe/ui on npm. */
export const UI_NPM_URL = "https://www.npmjs.com/package/@haruhimemoe/ui";

/** The install command /ui shows and copies. */
export const UI_INSTALL = "bun add @haruhimemoe/ui";

/** One slot of the sample pool: its slot name and mod, star rating, length in seconds, and BPM. */
export type SampleMap = {
  readonly slot: string;
  readonly mod: string;
  readonly stars: number;
  readonly length: number;
  readonly bpm: number;
};

/** A made-up 14-slot mappool for the FilterPanel, Table and osu! examples. */
export const SAMPLE_POOL: readonly SampleMap[] = [
  { slot: "NM1", mod: "NM", stars: 5.21, length: 128, bpm: 180 },
  { slot: "NM2", mod: "NM", stars: 5.48, length: 154, bpm: 172 },
  { slot: "NM3", mod: "NM", stars: 5.63, length: 97, bpm: 200 },
  { slot: "NM4", mod: "NM", stars: 5.9, length: 201, bpm: 165 },
  { slot: "HD1", mod: "HD", stars: 5.35, length: 142, bpm: 185 },
  { slot: "HD2", mod: "HD", stars: 5.72, length: 118, bpm: 190 },
  { slot: "HR1", mod: "HR", stars: 5.8, length: 133, bpm: 176 },
  { slot: "HR2", mod: "HR", stars: 6.12, length: 176, bpm: 160 },
  { slot: "DT1", mod: "DT", stars: 6.05, length: 88, bpm: 225 },
  { slot: "DT2", mod: "DT", stars: 6.4, length: 104, bpm: 240 },
  { slot: "DT3", mod: "DT", stars: 6.77, length: 92, bpm: 252 },
  { slot: "FM1", mod: "FM", stars: 5.6, length: 146, bpm: 182 },
  { slot: "FM2", mod: "FM", stars: 5.95, length: 163, bpm: 174 },
  { slot: "TB", mod: "TB", stars: 7.1, length: 312, bpm: 195 },
];
