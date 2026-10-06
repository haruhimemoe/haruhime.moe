/**
 * @file src/constants/changelogs.ts
 * @desc Every repo whose CHANGELOG.md /changelog shows: this site and the live tools (apps), the
 *       nine packages, and the Claude plugin. Built from TOOLS and LIBRARIES, so a tool shows up
 *       the day it gets a url and a new package the day it joins LIBRARIES. changelogUrls derives
 *       each repo's raw file, GitHub pages and page here. KIND_SEGMENTS names the
 *       /changelog/kind/<segment> filters; KIND_HEADINGS names each kind's group in the nav.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Tue Oct 6, 2026
 */

import { LIBRARIES } from "@/constants/libraries";
import { SITE } from "@/constants/site";
import { TOOLS } from "@/constants/tools";

/** What a repo is: a site (app), an npm package, or the Claude plugin. */
export type ChangelogKind = "app" | "package" | "plugin";

/** One repo with a changelog. */
export type ChangelogSource = {
  /** The URL segment: /changelog/<slug>. */
  readonly slug: string;
  /** The name the feed and the page title use. */
  readonly label: string;
  /** The GitHub repo under haruhimemoe. */
  readonly repo: string;
  readonly kind: ChangelogKind;
};

const source = (
  slug: string,
  label: string,
  repo: string,
  kind: ChangelogKind,
): ChangelogSource => ({ slug, label, repo, kind });

/** Every repo, in filter-nav order: this site and the live tools, the packages, the plugin. */
export const CHANGELOG_SOURCES: readonly ChangelogSource[] = [
  source(SITE.name, SITE.name, SITE.name, "app"),
  ...TOOLS.filter((tool) => tool.url).map((tool) =>
    source(tool.name, tool.name, `${tool.name}.haruhime.moe`, "app"),
  ),
  ...LIBRARIES.map((library) => source(library.name, library.name, library.repo, "package")),
  source("claude-plugin", "Claude plugin", "claude-plugin", "plugin"),
];

/**
 * @function findChangelogSource
 * @param slug {string} an untrusted route segment
 * @returns {ChangelogSource | undefined} the repo with that slug, or undefined
 */
export const findChangelogSource = (slug: string): ChangelogSource | undefined =>
  CHANGELOG_SOURCES.find((entry) => entry.slug === slug);

/** Where a repo's changelog lives: here, raw on main, and on GitHub. */
export type ChangelogUrls = {
  readonly page: `/changelog/${string}`;
  readonly raw: string;
  readonly file: string;
  readonly github: string;
  readonly releases: string;
};

/**
 * @function changelogUrls
 * @param entry {ChangelogSource} a repo
 * @returns {ChangelogUrls} its page here, its raw CHANGELOG.md on main, and its repo, file and
 *   releases on GitHub
 */
export const changelogUrls = (entry: ChangelogSource): ChangelogUrls => {
  const github = `${SITE.githubOrg}/${entry.repo}`;
  return {
    page: `/changelog/${entry.slug}`,
    raw: `https://raw.githubusercontent.com/haruhimemoe/${entry.repo}/main/CHANGELOG.md`,
    file: `${github}/blob/main/CHANGELOG.md`,
    github,
    releases: `${github}/releases`,
  };
};

/** The /changelog/kind/<segment> filters. The plugin is one repo, so its own page is its filter. */
export const KIND_SEGMENTS = {
  apps: {
    kind: "app",
    label: "Apps",
    description:
      "What changed on haruhime.moe and in each live tool (packs, pools, bb), release by release, newest first.",
  },
  packages: {
    kind: "package",
    label: "Packages",
    description:
      "What changed in each @haruhimemoe package (ui, next-kit, osu, hinai, pool and the rest), release by release, newest first.",
  },
} as const satisfies Record<string, { kind: ChangelogKind; label: string; description: string }>;

/** A kind filter's URL segment. */
export type KindSegment = keyof typeof KIND_SEGMENTS;

/**
 * @function isKindSegment
 * @param value {string} an untrusted route segment
 * @returns {boolean} true only for a key of KIND_SEGMENTS (own keys, so never a prototype key)
 */
export const isKindSegment = (value: string): value is KindSegment =>
  Object.hasOwn(KIND_SEGMENTS, value);

/** The changelog nav's group headings, in nav order: apps, packages, then the plugin. */
export const KIND_HEADINGS = {
  app: "Apps",
  package: "Packages",
  plugin: "Claude plugin",
} as const satisfies Record<ChangelogKind, string>;
