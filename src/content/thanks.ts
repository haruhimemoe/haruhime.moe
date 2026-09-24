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

// One entry per person or project: a name, an optional https link, and a short line.
/** Shown on /thanks in this order. */
export const THANKS: readonly ThanksEntry[] = [
  {
    name: "-Tynamo, Varler, RMarc, and the Evergreen Cup Staff!",
    line: "Thanks for giving me a shot and the opportunity to work with all of you!",
  },
  {
    name: "Enslow, Sohlayce, Zyoulou, Drou, Tienei, Wyrd, Rikki",
    line: "and so many others from osu!cafe server! without you guys, who knows where my dev journey would be today in relation to osu!",
  },
  {
    name: "hburn7",
    url: "https://github.com/hburn7/omc-api",
    line: "omc-api, the mappool rules my compliance checks are ported from.",
  },
  {
    name: "Sheppsu",
    url: "https://otdb.sheppsu.me",
    line: "otdb, and the okay to build the packs pool archive from its mappool export.",
  },
  {
    name: "the hinai beatmap mirror",
    url: "https://mirror.hinamizawa.ai",
    line: "serves the beatmap downloads, so I never host a file.",
  },
  {
    name: "ppy and the osu! team",
    url: "https://osu.ppy.sh",
    line: "osu! itself, and the API the tools read from.",
  },
];
