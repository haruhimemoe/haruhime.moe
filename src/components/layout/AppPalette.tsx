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
 * @modified Sun Oct 11, 2026
 */

"use client";

import { uiLabels } from "@haruhimemoe/next-kit/i18n";
import { type Command, CommandPalette, siteCommands } from "@haruhimemoe/ui";
import { useTranslations } from "next-intl";
import { CHANGELOG_SOURCES, changelogUrls } from "@/constants/changelogs";
import { LIBRARIES, libraryUrls } from "@/constants/libraries";
import { PAGE_PATHS, PAGES, SITE } from "@/constants/site";

type T = ReturnType<typeof useTranslations>;

/** This site's own pages, as the nav items siteCommands turns into "Go to <label>". */
const pageLinks = (t: T) =>
  PAGE_PATHS.map((path) => ({ href: path, label: t(`pageTitles.${path.slice(1) || "home"}`) }));

/** This repo, for siteCommands' "Open on GitHub" and "Report a bug". */
const REPO_URL = `${SITE.githubOrg}/haruhime.moe`;

/** "Open <name> docs" for every @haruhimemoe package, on top of the Navigate group's "Go to Libraries". */
const libraryCommands = (t: T): Command[] =>
  LIBRARIES.map((library) => ({
    id: `library.${library.name}`,
    title: t("palette.openDocs", { name: library.name }),
    subtitle: library.description,
    group: t("palette.libraries"),
    keywords: ["library", "package", library.pkg],
    run: (ctx) => ctx.navigate(libraryUrls(library).docs),
  }));

/** "Open <repo> changelog" for every repo with a changelog page. */
const changelogCommands = (t: T): Command[] =>
  CHANGELOG_SOURCES.map((entry) => ({
    id: `changelog.${entry.slug}`,
    title: t("palette.openChangelog", { name: entry.label }),
    group: t("palette.changelog"),
    keywords: ["changelog", "release", "releases"],
    run: (ctx) => ctx.navigate(changelogUrls(entry).page),
  }));

/**
 * @function AppPalette
 * @returns {JSX.Element} the site's one CommandPalette, mounted once in SiteShell
 */
export function AppPalette() {
  const t = useTranslations("hub");
  const ui = uiLabels(useTranslations("ui"));
  const commands: Command[] = [
    ...siteCommands({ pages: pageLinks(t), tools: false, repo: REPO_URL, labels: ui.siteCommands }),
    ...libraryCommands(t),
    ...changelogCommands(t),
  ];
  return (
    <CommandPalette
      storageKey="haruhime.moe"
      commands={commands}
      labels={ui.palette}
      placeholder={ui.paletteProps.placeholder}
      label={ui.paletteProps.label}
    />
  );
}
