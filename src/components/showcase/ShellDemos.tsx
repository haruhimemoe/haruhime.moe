/**
 * @file src/components/showcase/ShellDemos.tsx
 * @desc /ui's Shell group: SiteHeader, NavLinks, LinkTabs, HeaderMenu, SiteFooter (and its
 *       "haruhime tools" column: HARUHIME_TOOLS, haruhimeToolsColumn) and PageShell. The header,
 *       footer and frame are this page's own, so they get a note, not an example.
 *       Server-rendered; HeaderMenu brings its own client code.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Sep 28, 2026
 * @modified Mon Sep 28, 2026
 */

import {
  HARUHIME_TOOLS,
  HeaderMenu,
  haruhimeToolsColumn,
  LinkTabs,
  NavLinks,
  TextLink,
} from "@haruhimemoe/ui";
import { Demo } from "@/components/showcase/Demo";

/**
 * @function ShellDemos
 * @returns {JSX.Element} the Shell group's demos
 */
export function ShellDemos() {
  return (
    <>
      <Demo
        name="SiteHeader"
        note="The bar at the top of this page. The brand slot is the wordmark linking home, and the links are the tools, centered (navAlign center) in a nav named Tools. Tools that haven't launched show as text marked soon."
      />
      <Demo
        name="NavLinks"
        note="The link list inside SiteHeader. The current page's link gets aria-current and lights up: here, UI."
      >
        <nav aria-label="NavLinks example">
          <NavLinks
            links={[
              { label: "Home", href: "/" },
              { label: "UI", href: "/ui" },
              { label: "Brand", href: "/brand" },
              { label: "sheets", note: "soon" },
            ]}
          />
        </nav>
      </Demo>
      <Demo
        name="LinkTabs"
        note="A named nav of pill links, for switching views that are their own pages. The current one gets aria-current."
      >
        <LinkTabs
          label="LinkTabs example"
          items={[
            { href: "/ui?tab=pools#shell", label: "Pools", current: true },
            { href: "/ui?tab=maps#shell", label: "Maps" },
            { href: "/ui?tab=played#shell", label: "Played in pools" },
          ]}
        />
      </Demo>
      <Demo
        name="HeaderMenu"
        note="The header's account menu: a button that opens links. Escape, a click outside or leaving it closes the menu."
      >
        <HeaderMenu
          label="haruhime"
          buttonLabel="Account menu"
          align="start"
          items={[
            { href: "/ui?menu=pools#shell", label: "Your pools" },
            { href: "/ui?menu=account#shell", label: "Account" },
          ]}
        />
      </Demo>
      <Demo
        name="SiteFooter"
        note="The footer below: the Tools, haruhime.moe and Legal columns, the trademark line as fine print, and the Discord and GitHub icon links. The tool sites also show the haruhime.moe wordmark there, and pass tools={{ current }} for a haruhime tools column linking the other tools. This site turns both off: it is haruhime.moe, and its Tools column already lists every tool."
      />
      <Demo
        name="HARUHIME_TOOLS"
        note="The live tools as data: id, name, home page and a few words each. A tool joins the list when it goes live."
      >
        <ul className="flex flex-col gap-1 text-sm">
          {HARUHIME_TOOLS.map((tool) => (
            <li key={tool.id}>
              <TextLink href={tool.href}>{tool.name}</TextLink>: {tool.blurb}
            </li>
          ))}
        </ul>
      </Demo>
      <Demo
        name="haruhimeToolsColumn"
        note="The footer column SiteFooter's tools prop adds, as plain data for a footer laid out by hand. Here from pools: pools is left out, and All tools links haruhime.moe."
      >
        <nav aria-label="haruhimeToolsColumn example">
          <p className="mb-2 font-bold text-c4 text-xs uppercase tracking-wide">
            {haruhimeToolsColumn({ current: "pools" }).title}
          </p>
          <ul className="flex flex-col gap-1 text-sm">
            {haruhimeToolsColumn({ current: "pools" }).items.map((item) => (
              <li key={item.label}>
                <TextLink href={item.href ?? "/"}>{item.label}</TextLink>
              </li>
            ))}
          </ul>
        </nav>
      </Demo>
      <Demo
        name="PageShell"
        note="The frame around this page: a skip link (press Tab on a fresh load), the header, the main content and the footer, which stays at the bottom on short pages."
      />
    </>
  );
}
