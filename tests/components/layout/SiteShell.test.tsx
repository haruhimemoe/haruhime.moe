/**
 * @file tests/components/layout/SiteShell.test.tsx
 * @desc SiteShell: skip link to #main and one main landmark; the header's wordmark links home and
 *       the four tools sit in the Tools nav with packs and pools linked; the footer's Tools /
 *       haruhime.moe / Legal columns, unreleased tools as plain text, the Discord and GitHub icon
 *       links (Discord as an icon only, not in a column), the trademark notice, and no
 *       parent-site wordmark.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Sat Oct 3, 2026
 */

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteShell } from "@/components/layout/SiteShell";
import { SITE } from "@/constants/site";

const renderShell = () =>
  render(
    <SiteShell>
      <p>content</p>
    </SiteShell>,
  );

describe("SiteShell frame", () => {
  it("has a skip link to #main and exactly one main landmark", () => {
    renderShell();
    expect(screen.getByRole("link", { name: "Skip to content" })).toHaveAttribute("href", "#main");
    const mains = screen.getAllByRole("main");
    expect(mains).toHaveLength(1);
    expect(mains[0]).toHaveAttribute("id", "main");
  });

  it("wraps the page between the header and the footer", () => {
    renderShell();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(within(screen.getByRole("main")).getByText("content")).toBeInTheDocument();
  });
});

describe("SiteShell header", () => {
  it("links the wordmark home, drawn inline by @haruhimemoe/ui", () => {
    renderShell();
    const banner = screen.getByRole("banner");
    const home = within(banner).getByRole("link", { name: "haruhime.moe home" });
    expect(home).toHaveAttribute("href", "/");
    // The inline SVG is decorative: the link carries the name, and no file loads.
    expect(home.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(home.querySelector("img")).toBeNull();
  });

  it("centers the four tools, with packs, pools and bb as links", () => {
    renderShell();
    const tools = within(screen.getByRole("banner")).getByRole("navigation", { name: "Tools" });
    expect(within(tools).getByRole("link", { name: "packs" })).toHaveAttribute(
      "href",
      "https://packs.haruhime.moe",
    );
    expect(within(tools).getByRole("link", { name: "pools" })).toHaveAttribute(
      "href",
      "https://pools.haruhime.moe",
    );
    expect(within(tools).getByRole("link", { name: "bb" })).toHaveAttribute(
      "href",
      "https://bb.haruhime.moe",
    );
    expect(within(tools).getAllByRole("link")).toHaveLength(3);
    expect(within(tools).getAllByRole("listitem")).toHaveLength(4);
    // Plain text, not a disabled control: nothing to focus, so no aria-disabled either.
    const sheets = within(tools).getByText("sheets").closest("li");
    expect(sheets).toHaveTextContent("sheets soon");
    expect(sheets?.querySelector("[aria-disabled]")).toBeNull();
  });
});

describe("SiteShell footer", () => {
  it("has one Footer nav holding three headed columns, in order", () => {
    renderShell();
    const footer = screen.getByRole("contentinfo");
    const nav = within(footer).getByRole("navigation", { name: "Footer" });
    expect(within(footer).getAllByRole("navigation")).toHaveLength(1);
    const names = within(nav)
      .getAllByRole("region")
      .map((column) => column.getAttribute("aria-labelledby"))
      .map((id) => document.getElementById(id ?? "")?.textContent);
    expect(names).toEqual(["Tools", "haruhime.moe", "Legal"]);
    expect(within(nav).getAllByRole("heading", { level: 2 })).toHaveLength(3);
  });

  it("never links /ui from the footer: the libraries page and the ui card reach it", () => {
    renderShell();
    const footer = screen.getByRole("contentinfo");
    expect(within(footer).queryByRole("link", { name: "UI" })).toBeNull();
  });

  it("links packs, pools and bb and shows sheets as plain text marked soon", () => {
    renderShell();
    const tools = within(screen.getByRole("contentinfo")).getByRole("region", { name: "Tools" });
    expect(within(tools).getByRole("link", { name: "packs" })).toHaveAttribute(
      "href",
      "https://packs.haruhime.moe",
    );
    expect(within(tools).getByRole("link", { name: "pools" })).toHaveAttribute(
      "href",
      "https://pools.haruhime.moe",
    );
    expect(within(tools).getByRole("link", { name: "bb" })).toHaveAttribute(
      "href",
      "https://bb.haruhime.moe",
    );
    expect(within(tools).getAllByRole("link")).toHaveLength(3);
    expect(within(tools).getByText("sheets").closest("li")).toHaveTextContent("sheets soon");
  });

  it("links the site pages", () => {
    renderShell();
    const footer = screen.getByRole("contentinfo");
    const site = within(footer).getByRole("region", { name: "haruhime.moe" });
    const expected = [
      ["Thanks", "/thanks"],
      ["Libraries", "/libraries"],
      ["Brand", "/brand"],
      ["Contact", "/contact"],
    ] as const;
    const links = within(site).getAllByRole("link");
    expect(links.map((link) => link.textContent)).toEqual(expected.map(([name]) => name));
    for (const [name, href] of expected) {
      expect(within(site).getByRole("link", { name })).toHaveAttribute("href", href);
    }
    const legal = within(footer).getByRole("region", { name: "Legal" });
    const legalLinks = within(legal).getAllByRole("link");
    expect(legalLinks.map((link) => [link.textContent, link.getAttribute("href")])).toEqual([
      ["Disclaimer", "/disclaimer"],
      ["Terms", "/terms"],
      ["Privacy", "/privacy"],
    ]);
  });

  it("links a GitHub icon to the org, with an accessible name", () => {
    renderShell();
    const link = within(screen.getByRole("contentinfo")).getByRole("link", {
      name: "haruhimemoe on GitHub",
    });
    expect(link).toHaveAttribute("href", "https://github.com/haruhimemoe");
    expect(link.querySelector("svg")).toBeInTheDocument();
  });

  it("links a white Discord icon to the server, before the GitHub icon, in the same tab", () => {
    renderShell();
    const footer = screen.getByRole("contentinfo");
    const discord = within(footer).getByRole("link", { name: "Discord" });
    expect(discord).toHaveAttribute("href", SITE.discordUrl);
    expect(discord).not.toHaveAttribute("target");
    expect(discord).toHaveClass("text-c1");
    expect(discord.querySelector("svg")).toBeInTheDocument();
    expect(discord).toHaveTextContent("");
    const github = within(footer).getByRole("link", { name: "haruhimemoe on GitHub" });
    expect(discord.compareDocumentPosition(github) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    for (const column of within(footer).getAllByRole("region")) {
      expect(within(column).queryByRole("link", { name: "Discord" })).not.toBeInTheDocument();
    }
  });

  it("keeps the trademark notice as fine print, with no parent-site wordmark", () => {
    renderShell();
    const footer = screen.getByRole("contentinfo");
    expect(within(footer).getByText(SITE.trademarkNotice)).toBeInTheDocument();
    expect(within(footer).queryByRole("link", { name: "haruhime.moe" })).not.toBeInTheDocument();
  });
});
