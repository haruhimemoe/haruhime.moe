/**
 * @file src/components/showcase/CommandPaletteDemos.tsx
 * @desc /ui's command palette demos, the first half of the Palette group: CommandPalette
 *       (mounted exactly once; its Ctrl K/Cmd K hotkey is page-global), CommandPaletteButton (the
 *       click target other pages put in SiteHeader's actions), openCommandPalette (the imperative
 *       open, no ref needed) and siteCommands (the defaults this demo's palette includes). The
 *       command list is a couple of demo-only entries plus siteCommands built from this site's
 *       real pages (PAGES) and this repo; `tools: false` because haruhime.moe is the parent site,
 *       not one of HARUHIME_TOOLS, so the default "Open haruhime.moe" entry would just point at
 *       the page you're already on.
 *       A client component: CommandPalette holds state and openCommandPalette needs the browser.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Sun Oct 4, 2026
 */

"use client";

import {
  buttonClasses,
  type Command,
  CommandPalette,
  CommandPaletteButton,
  openCommandPalette,
  siteCommands,
} from "@haruhimemoe/ui";
import { Demo } from "@/components/showcase/Demo";
import { PAGE_PATHS, PAGES, SITE } from "@/constants/site";

/** This site's own pages, as the nav items siteCommands turns into "Go to <label>". */
const PAGE_LINKS = PAGE_PATHS.map((path) => ({ href: path, label: PAGES[path].title }));

/** This repo, for siteCommands' "Open on GitHub" and "Report a bug". */
const REPO_URL = `${SITE.githubOrg}/haruhime.moe`;

const COMMANDS: Command[] = [
  {
    id: "demo.hello",
    title: "Say hi",
    subtitle: "A demo-only command; copies to the clipboard",
    group: "Demo",
    run: (ctx) => ctx.copy("hi"),
  },
  ...siteCommands({ pages: PAGE_LINKS, tools: false, repo: REPO_URL }),
];

/**
 * @function CommandPaletteDemos
 * @returns {JSX.Element} the CommandPalette, CommandPaletteButton, openCommandPalette and
 *   siteCommands demos
 */
export function CommandPaletteDemos() {
  return (
    <>
      <Demo
        name="CommandPalette"
        note="Renders nothing until opened. Mounted once for this whole page, so Ctrl K (Cmd K) opens it from anywhere on /ui, not just this box."
      >
        <CommandPalette storageKey="ui-showcase" commands={COMMANDS} />
        <p className="text-c4 text-xs">Press Ctrl K (Cmd K), or use a button below.</p>
      </Demo>

      <Demo
        name="CommandPaletteButton"
        note="A ghost button with a magnifier, your children as its label, and the hotkey hint."
      >
        <CommandPaletteButton>Search</CommandPaletteButton>
      </Demo>

      <Demo
        name="openCommandPalette"
        note="Opens the mounted palette from anywhere, with no ref: a window event, so a plain button works."
      >
        <button
          type="button"
          className={buttonClasses({ variant: "secondary" })}
          onClick={() => openCommandPalette()}
        >
          Open the palette
        </button>
      </Demo>

      <Demo
        name="siteCommands"
        note={`The defaults above the Demo group: Navigate ("Go to <page>" for every page in PAGES), Page (copy URL, back, top, reload, GitHub) and Help ("Report a bug" on ${REPO_URL.replace("https://github.com/", "")}). tools is false here since haruhime.moe isn't one of HARUHIME_TOOLS.`}
      />
    </>
  );
}
