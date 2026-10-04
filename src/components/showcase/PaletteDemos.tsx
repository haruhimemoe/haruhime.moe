/**
 * @file src/components/showcase/PaletteDemos.tsx
 * @desc /ui's Palette group: CommandPalette (mounted exactly once; its Ctrl K/Cmd K hotkey is
 *       page-global), CommandPaletteButton (the click target other pages put in SiteHeader's
 *       actions), openCommandPalette (the imperative open, no ref needed) and siteCommands (the
 *       defaults this demo's palette includes), plus the calculator and search-ranking helpers
 *       siteCommands doesn't cover on its own: evaluate, formatResult and fuzzyScore. The command
 *       list is a couple of demo-only entries plus siteCommands built from this site's real pages
 *       (PAGES) and this repo; `tools: false` because haruhime.moe is the parent site, not one of
 *       HARUHIME_TOOLS, so the default "Open haruhime.moe" entry would just point at the page
 *       you're already on.
 *       A client component: CommandPalette holds state and openCommandPalette needs the browser.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sat Oct 3, 2026
 * @modified Sat Oct 3, 2026
 */

"use client";

import {
  buttonClasses,
  type Command,
  CommandPalette,
  CommandPaletteButton,
  evaluate,
  formatResult,
  fuzzyScore,
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
 * @function PaletteDemos
 * @returns {JSX.Element} the Palette group's demos
 */
export function PaletteDemos() {
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

      <Demo
        name="evaluate"
        note="The palette's calculator, without eval: +-*/%^, unary minus, parentheses, k/m suffixes, pi, e, sqrt, abs, round, floor, ceil, min and max. Unparseable or non-finite is null."
      >
        {/* biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable region needs keyboard focus */}
        <pre tabIndex={0} className="overflow-x-auto rounded-md bg-b5 p-3 text-c2 text-sm">
          <code>
            {'evaluate("1.5k * (2 + sqrt(9))")'}
            {"\n"}
            {`// ${evaluate("1.5k * (2 + sqrt(9))")}`}
          </code>
        </pre>
      </Demo>

      <Demo
        name="formatResult"
        note="A calculator result as the palette shows it: up to 10 significant digits, trailing zeros dropped."
      >
        {/* biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable region needs keyboard focus */}
        <pre tabIndex={0} className="overflow-x-auto rounded-md bg-b5 p-3 text-c2 text-sm">
          <code>
            {"formatResult(1 / 3)"}
            {"\n"}
            {`// "${formatResult(1 / 3)}"`}
          </code>
        </pre>
      </Demo>

      <Demo
        name="fuzzyScore"
        note="The palette's own ranking: a query matches when its letters appear in order, scored higher at a word start. A Provider can reuse it to rank its own rows the same way."
      >
        {/* biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable region needs keyboard focus */}
        <pre tabIndex={0} className="overflow-x-auto rounded-md bg-b5 p-3 text-c2 text-sm">
          <code>
            {'fuzzyScore("cpu", "Copy page URL")'}
            {"\n"}
            {`// ${JSON.stringify(fuzzyScore("cpu", "Copy page URL"))}`}
            {"\n"}
            {'fuzzyScore("go", "Sign out")'}
            {"\n"}
            {`// ${JSON.stringify(fuzzyScore("go", "Sign out"))}`}
          </code>
        </pre>
      </Demo>
    </>
  );
}
