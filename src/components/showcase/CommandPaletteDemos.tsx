/**
 * @file src/components/showcase/CommandPaletteDemos.tsx
 * @desc /ui's command palette demos, the first half of the Palette group: CommandPalette,
 *       CommandPaletteButton (the click target other pages put in SiteHeader's actions),
 *       openCommandPalette (the imperative open, no ref needed) and siteCommands (the defaults
 *       the mounted palette includes). CommandPalette itself has no example box here: the real
 *       one is already mounted once for the whole site, by AppPalette in SiteShell, and its Ctrl
 *       K/Cmd K hotkey is page-global, so a second mount on this page would fight it for the same
 *       hotkey. CommandPaletteButton and openCommandPalette below both open that same site
 *       palette, built from this site's real pages (PAGES), its libraries and changelog, and this
 *       repo; see AppPalette for the full command list.
 *       A client component: openCommandPalette needs the browser.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Mon Oct 5, 2026
 */

"use client";

import { buttonClasses, CommandPaletteButton, openCommandPalette } from "@haruhimemoe/ui";
import { Demo } from "@/components/showcase/Demo";
import { SITE } from "@/constants/site";

/** This repo, named in the siteCommands note below. */
const REPO_URL = `${SITE.githubOrg}/haruhime.moe`;

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
        note="Renders nothing until opened. This page doesn't mount its own: the site already has one, mounted once by AppPalette in SiteShell, so its Ctrl K (Cmd K) hotkey stays page-global instead of fighting a second instance here. Press Ctrl K (Cmd K), or use a button below, to open it."
      />

      <Demo
        name="CommandPaletteButton"
        note="A ghost button with a magnifier, your children as its label, and the hotkey hint. Opens the site's palette, the same one SiteHeader's actions slot uses."
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
        note={`The defaults in the site palette: Navigate ("Go to <page>" for every page in PAGES), Page (copy URL, back, top, reload, GitHub) and Help ("Report a bug" on ${REPO_URL.replace("https://github.com/", "")}), plus AppPalette's own Libraries and Changelog groups. tools is false since haruhime.moe isn't one of HARUHIME_TOOLS.`}
      />
    </>
  );
}
