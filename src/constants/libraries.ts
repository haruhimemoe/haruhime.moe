/**
 * @file src/constants/libraries.ts
 * @desc The @haruhimemoe packages the tools are built from, shown on /libraries and each at
 *       /libraries/<name>: npm name, repo, hue, a one-line description and, for ui, the showcase
 *       page. Every repo is github.com/haruhimemoe/<name> and publishes @haruhimemoe/<name>, so
 *       libraryUrls derives the rest. Descriptions match each package.json's first sentence.
 *       libraryLinkItems builds a library's card links (GitHub, npm, Changelog, Showcase).
 * @author David @dvhsh (https://dvh.sh)
 * @created Fri Oct 2, 2026
 * @modified Tue Oct 6, 2026
 */

import type { LinkRowItem } from "@haruhimemoe/ui";
import { SITE } from "@/constants/site";

/** One package. `name` is the short name, the URL segment and the repo name. */
export type Library = {
  readonly name: string;
  /** The npm package, `@haruhimemoe/<name>`. */
  readonly pkg: `@haruhimemoe/${string}`;
  /** The GitHub repo under haruhimemoe, the same as `name`. */
  readonly repo: string;
  /** The brand hue the repo banner draws with. */
  readonly hue: number;
  /** One sentence: what the package does. */
  readonly description: string;
  /** A page on this site that shows the package live. Only ui has one. */
  readonly showcase?: `/${string}`;
};

const lib = (name: string, hue: number, description: string, showcase?: `/${string}`): Library => ({
  name,
  pkg: `@haruhimemoe/${name}`,
  repo: name,
  hue,
  description,
  ...(showcase ? { showcase } : {}),
});

/** Every package, in the order /libraries lists them: the app-facing ones first, then the data. */
export const LIBRARIES: readonly Library[] = [
  lib(
    "ui",
    333,
    "React components for the tools on Next.js: the osu!-web palette as a Tailwind theme, buttons, forms, filters, tables, osu! pieces and the site shell.",
    "/ui",
  ),
  lib(
    "next-kit",
    333,
    "The Next.js plumbing the tools share: JSON route helpers, rate limits in MongoDB, sign in with osu! via better-auth, SEO metadata, sitemaps and llms.txt.",
  ),
  lib(
    "osu",
    333,
    "osu! API v2 client and zod shapes for beatmaps, beatmapsets and users, with browser-safe types, links, cover URLs and number formatting.",
  ),
  lib(
    "mirror",
    333,
    "Downloads osu! beatmapsets (.osz) from whichever public mirror has them, hinai first, with failover, cooldowns, zip checks and the hinai client.",
  ),
  lib(
    "pool",
    333,
    "osu! tournament mappools as data: slots, mod buckets, custom slots with forced or free mods, zod validation and the pack key codec.",
  ),
  lib(
    "compliance",
    333,
    "Checks osu! beatmapsets against the content rules for officially supported tournaments, a port of hburn7's rules with vendored data.",
  ),
  lib(
    "bbcode",
    333,
    "Parses, renders, lints and counts osu! BBCode the way osu! does: safe HTML, template fields, flags, imagemaps and osu!'s own widths.",
  ),
  lib(
    "vcs",
    333,
    "Revisions, diffs and 3-way merges for JSON documents and text: line diffs, keyed-list aware JSON diffs, diff3 text merges and canonical hashing.",
  ),
  lib(
    "time",
    333,
    "Timezones, weekly availability, match slot finding, regions and .ics files for tournament and event tools.",
  ),
  lib(
    "crowdfund",
    333,
    "Crowdfunding state as data: goals, tiers, donations and refunds, minor-unit money math, progress, top donors and webhook helpers.",
  ),
  lib(
    "invites",
    333,
    "Invites as consent: zod schemas for invites and their terms, a pure state machine, resend cooldowns, blocks, rate limits and inbox grouping.",
  ),
  lib(
    "brand",
    333,
    "Brand kit generator for the tools: palettes from one hue, Nunito wordmarks, monogram icons, README banners and Open Graph cards.",
  ),
];

const NAMES = new Set(LIBRARIES.map((entry) => entry.name));

/**
 * @function isLibraryName
 * @param value {string} an untrusted route segment
 * @returns {boolean} true only for a listed library's name (a Set lookup, so never a prototype key)
 */
export const isLibraryName = (value: string): boolean => NAMES.has(value);

/**
 * @function findLibrary
 * @param name {string} a library name
 * @returns {Library | undefined} the library, or undefined when the name isn't listed
 */
export const findLibrary = (name: string): Library | undefined =>
  LIBRARIES.find((entry) => entry.name === name);

/** Where a library's docs, source, package, changelog and raw README live. */
export type LibraryUrls = {
  readonly docs: `/libraries/${string}`;
  readonly github: string;
  readonly npm: string;
  readonly changelog: string;
  /** The repo's changelog page on this site. */
  readonly changelogPage: `/changelog/${string}`;
  readonly readme: string;
};

/**
 * @function libraryUrls
 * @param library {Library} a library
 * @returns {LibraryUrls} its docs page here, repo and changelog on GitHub, package on npm, its
 *   changelog page here, and the raw README the docs page renders
 */
export const libraryUrls = (library: Library): LibraryUrls => {
  const github = `${SITE.githubOrg}/${library.repo}`;
  return {
    docs: `/libraries/${library.name}`,
    github,
    npm: `https://www.npmjs.com/package/${library.pkg}`,
    changelog: `${github}/blob/main/CHANGELOG.md`,
    changelogPage: `/changelog/${library.name}`,
    readme: `https://raw.githubusercontent.com/haruhimemoe/${library.repo}/main/README.md`,
  };
};

/**
 * @function libraryLinkItems
 * @param library {Library} the library
 * @returns {LinkRowItem[]} its GitHub, npm and changelog links, plus the showcase when it has one
 */
export const libraryLinkItems = (library: Library): LinkRowItem[] => {
  const urls = libraryUrls(library);
  return [
    { href: urls.github, label: "GitHub" },
    { href: urls.npm, label: "npm" },
    { href: urls.changelogPage, label: "Changelog" },
    ...(library.showcase ? [{ href: library.showcase, label: "Showcase" }] : []),
  ];
};
