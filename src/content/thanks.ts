/**
 * @file src/content/thanks.ts
 * @desc The /thanks list: people and projects the haruhime.moe tools lean on.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

/** One thanks entry: who, where to find them (optional), and one line on what they did. */
export type ThanksEntry = {
  name: string;
  url?: string;
  line: string;
};

// David: add people here. One entry each, a short line in your own words, https links only.
/** Shown on /thanks in this order. */
export const THANKS: readonly ThanksEntry[] = [
  {
    name: "hburn7",
    url: "https://github.com/hburn7/omc-api",
    line: "omc-api, the mappool rules our compliance checks are ported from.",
  },
  {
    name: "the hinai beatmap mirror",
    url: "https://mirror.hinamizawa.ai",
    line: "serves the beatmap downloads, so we never host a file.",
  },
  {
    name: "ppy and the osu! team",
    url: "https://osu.ppy.sh",
    line: "osu! itself, and the API the tools read from.",
  },
];
