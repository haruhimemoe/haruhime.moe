/**
 * @file src/components/layout/AppPalette.tsx
 * @desc The command palette mounted once for the whole site, in SiteShell: siteCommands' Navigate
 *       (every page in PAGES), Page and Help groups, plus this site's own extras: "Open <name>
 *       docs" for each @haruhimemoe library and "Open <repo> changelog" for each changelog
 *       source. No account group: haruhime.moe has no accounts. `tools: false` since this is the
 *       parent site, not one of HARUHIME_TOOLS, so the default "Open haruhime.moe" entry would
 *       just point at the page you're already on.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Oct 5, 2026
 * @modified Mon Oct 5, 2026
 */

"use client";

import { type Command, CommandPalette, siteCommands } from "@haruhimemoe/ui";
import { CHANGELOG_SOURCES, changelogUrls } from "@/constants/changelogs";
import { LIBRARIES, libraryUrls } from "@/constants/libraries";
import { PAGE_PATHS, PAGES, SITE } from "@/constants/site";

/** This site's own pages, as the nav items siteCommands turns into "Go to <label>". */
const PAGE_LINKS = PAGE_PATHS.map((path) => ({ href: path, label: PAGES[path].title }));

/** This repo, for siteCommands' "Open on GitHub" and "Report a bug". */
const REPO_URL = `${SITE.githubOrg}/haruhime.moe`;

/** "Open <name> docs" for every @haruhimemoe package, on top of the Navigate group's "Go to Libraries". */
const LIBRARY_COMMANDS: Command[] = LIBRARIES.map((library) => ({
  id: `library.${library.name}`,
  title: `Open ${library.name} docs`,
  subtitle: library.description,
  group: "Libraries",
  keywords: ["library", "package", library.pkg],
  run: (ctx) => ctx.navigate(libraryUrls(library).docs),
}));

/** "Open <repo> changelog" for every repo with a changelog page. */
const CHANGELOG_COMMANDS: Command[] = CHANGELOG_SOURCES.map((entry) => ({
  id: `changelog.${entry.slug}`,
  title: `Open ${entry.label} changelog`,
  group: "Changelog",
  keywords: ["changelog", "release", "releases"],
  run: (ctx) => ctx.navigate(changelogUrls(entry).page),
}));

const COMMANDS: Command[] = [
  ...siteCommands({ pages: PAGE_LINKS, tools: false, repo: REPO_URL }),
  ...LIBRARY_COMMANDS,
  ...CHANGELOG_COMMANDS,
];

/**
 * @function AppPalette
 * @returns {JSX.Element} the site's one CommandPalette, mounted once in SiteShell
 */
export function AppPalette() {
  return <CommandPalette storageKey="haruhime.moe" commands={COMMANDS} />;
}
