/**
 * @file src/constants/tools.ts
 * @desc The haruhime.moe tools shown on the homepage, in the header and footer, on /brand and in
 *       /llms.txt. Names, marks, hues and taglines match @haruhimemoe/brand's product table. A
 *       tool without a `url` hasn't launched: it shows as "coming soon" and never links anywhere.
 *       A live tool still in beta says so on its homepage card and in /llms.txt.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Fri Sep 25, 2026
 */

/** One tool. `url` is set only once the tool is live. */
export type Tool = {
  name: string;
  hue: number;
  tagline: string;
  icon: string;
  url?: string;
  /** A live tool that's still in beta: its homepage card and /llms.txt line say so. */
  beta?: boolean;
  /** What the tool does, in a sentence or two, for /llms.txt. */
  about?: string;
  /** The tool serves its own /llms.txt, which ours links. */
  llmsTxt?: boolean;
};

/** Every tool in launch order. Give a tool its `url` when it goes live. */
export const TOOLS: readonly Tool[] = [
  {
    name: "packs",
    hue: 333,
    tagline: "osu! beatmap packs for tournament hosts",
    icon: "brand/packs-icon.svg",
    url: "https://packs.haruhime.moe",
    about:
      "Builds a mappool from pasted beatmap IDs or links and downloads it as one zip or a torrent. A pack key rebuilds the same pool for anyone.",
    llmsTxt: true,
  },
  {
    name: "pools",
    hue: 200,
    tagline: "osu! mappools for tournament hosts",
    icon: "brand/pools-icon.svg",
    url: "https://pools.haruhime.moe",
    beta: true,
    about:
      "Lists past tournament pools from several sources (otdb, tournament hosts and community submissions), searches every osu! map, leaving out maps that officially supported tournaments can't use, shows where a map was played before, and checks a pool against the content rules.",
    llmsTxt: true,
  },
  {
    name: "sheets",
    hue: 150,
    tagline: "osu! tournament sheets",
    icon: "brand/sheets-icon.svg",
  },
];
