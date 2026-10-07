/**
 * @file src/constants/tools.ts
 * @desc The haruhime.moe tools shown on the homepage, in the header and footer, on /brand and in
 *       /llms.txt. Names, marks, hues and taglines match @haruhimemoe/brand's product table. A
 *       tool without a `url` hasn't launched: it shows as "coming soon" and never links anywhere.
 *       A live tool still in beta says so on its homepage card and in /llms.txt. A live tool's
 *       card also carries one concrete sentence and a link to its main task.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Oct 7, 2026
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
  /**
   * What the tool does, in a sentence or two, for /llms.txt. A tool that hasn't launched can
   * carry it ready; /llms.txt prints it once the tool has a `url`.
   */
  about?: string;
  /** The tool serves its own /llms.txt, which ours links. */
  llmsTxt?: boolean;
  /** One concrete sentence for the homepage card: what you do with the tool. Live tools only. */
  summary?: string;
  /** The homepage card's second link: the tool's main task, a path on the tool's own site. */
  task?: { label: string; path: `/${string}` };
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
    summary: "Paste beatmap IDs or links and get the whole pool as one zip or a torrent.",
    task: { label: "Make a pack", path: "/new" },
  },
  {
    name: "pools",
    hue: 200,
    tagline: "osu! mappools for tournament hosts",
    icon: "brand/pools-icon.svg",
    url: "https://pools.haruhime.moe",
    beta: true,
    about:
      "Builds tournament mappools: sign in with osu!, search every osu! map under a mod lens (star rating, AR and OD as the mod changes them), add co-editors, and download the finished pool through packs. Past tournament pools from several sources (tournament hosts, community submissions and otdb) are there for reference, with where a map was played before and a check against the content rules for officially supported tournaments.",
    llmsTxt: true,
    summary: "Search maps with mods applied, build a pool with co-editors, and look up past pools.",
    task: { label: "Make a pool", path: "/new" },
  },
  {
    name: "bb",
    hue: 265,
    tagline: "osu! BBCode editor and templates",
    icon: "brand/bb-icon.svg",
    url: "https://bb.haruhime.moe",
    about:
      "An osu! BBCode editor with a live osu!-style preview, built-in and public templates, flags, colors and a collab (imagemap) maker.",
    llmsTxt: true,
    summary: "Write a userpage or forum post in osu! BBCode and see it as you type.",
    task: { label: "Make a collab banner", path: "/collab" },
  },
  {
    name: "harumin",
    hue: 350,
    tagline: "the osu! Discord bot",
    icon: "brand/harumin-icon.svg",
    url: "https://harumin.haruhime.moe",
    about:
      "An osu! Discord bot: profiles, recent and top plays with pp worked out on the spot, map cards for beatmap links that the channel remembers for later commands, match costs, top play tracking, and cards for packs and pools links. Server managers set it up on its dashboard.",
    llmsTxt: true,
    summary:
      "osu! profiles, scores and pp in your Discord server, with map cards that remember the map.",
    task: { label: "See the commands", path: "/commands" },
  },
  {
    name: "sheets",
    hue: 150,
    tagline: "osu! tournament sheets",
    icon: "brand/sheets-icon.svg",
  },
];
