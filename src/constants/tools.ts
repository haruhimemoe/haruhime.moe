/**
 * @file src/constants/tools.ts
 * @desc The haruhime.moe tools shown on the homepage, in the footer and on /brand. Names, marks,
 *       hues and taglines match @haruhimemoe/brand's product table. A tool without a `url` hasn't
 *       launched: it shows as "coming soon" and never links anywhere.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

/** One tool. `url` is set only once the tool is live. */
export type Tool = {
  name: string;
  hue: number;
  tagline: string;
  icon: string;
  url?: string;
};

/** Every tool in launch order. Give a tool its `url` when it goes live. */
export const TOOLS: readonly Tool[] = [
  {
    name: "packs",
    hue: 333,
    tagline: "osu! beatmap packs for tournament hosts",
    icon: "brand/packs-icon.svg",
    url: "https://packs.haruhime.moe",
  },
  {
    name: "pools",
    hue: 200,
    tagline: "osu! mappools for tournament hosts",
    icon: "brand/pools-icon.svg",
  },
  {
    name: "sheets",
    hue: 150,
    tagline: "osu! tournament sheets",
    icon: "brand/sheets-icon.svg",
  },
];
