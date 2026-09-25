/**
 * @file tests/components/layout/SiteShell.test.tsx
 * @desc SiteShell: skip link to #main and one main landmark; the header's wordmark links home and
 *       the three tools sit in the Tools nav with packs and pools linked; the footer's Tools /
 *       haruhime.moe / Legal columns, unreleased tools as plain text, the Discord and GitHub icon
 *       links (Discord as an icon only, not in a column), the trademark notice, and no
 *       parent-site wordmark.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Fri Sep 25, 2026
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
  it("links the wordmark home", () => {
    renderShell();
    const banner = screen.getByRole("banner");
    expect(within(banner).getByRole("link", { name: "haruhime.moe home" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(within(banner).getByRole("img", { name: "haruhime.moe home" })).toHaveAttribute(
      "src",
      "/brand/haruhime-wordmark.svg",
    );
  });

  it("centers the three tools, with packs and pools as links", () => {
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
    expect(within(tools).getAllByRole("link")).toHaveLength(2);
    expect(within(tools).getAllByRole("listitem")).toHaveLength(3);
    const item = within(tools).getByText("sheets").closest('[aria-disabled="true"]');
    expect(item).not.toBeNull();
    expect(item).toHaveTextContent("sheets soon");
  });
});

describe("SiteShell footer", () => {
  it("has three labelled columns", () => {
    renderShell();
    const footer = screen.getByRole("contentinfo");
    for (const name of ["Tools", "haruhime.moe", "Legal"]) {
      expect(within(footer).getByRole("navigation", { name })).toBeInTheDocument();
    }
  });

  it("links packs and pools and shows sheets as plain text marked soon", () => {
    renderShell();
    const tools = within(screen.getByRole("contentinfo")).getByRole("navigation", {
      name: "Tools",
    });
    expect(within(tools).getByRole("link", { name: "packs" })).toHaveAttribute(
      "href",
      "https://packs.haruhime.moe",
    );
    expect(within(tools).getByRole("link", { name: "pools" })).toHaveAttribute(
      "href",
      "https://pools.haruhime.moe",
    );
    expect(within(tools).getAllByRole("link")).toHaveLength(2);
    expect(within(tools).getByText("sheets").closest("li")).toHaveTextContent("sheets soon");
  });

  it("links the site pages", () => {
    renderShell();
    const footer = screen.getByRole("contentinfo");
    const site = within(footer).getByRole("navigation", { name: "haruhime.moe" });
    const expected = [
      ["Thanks", "/thanks"],
      ["Brand", "/brand"],
      ["UI", "/ui"],
      ["Contact", "/contact"],
    ] as const;
    const links = within(site).getAllByRole("link");
    expect(links.map((link) => link.textContent)).toEqual(expected.map(([name]) => name));
    for (const [name, href] of expected) {
      expect(within(site).getByRole("link", { name })).toHaveAttribute("href", href);
    }
    const legal = within(footer).getByRole("navigation", { name: "Legal" });
    expect(within(legal).getByRole("link", { name: "Disclaimer" })).toHaveAttribute(
      "href",
      "/disclaimer",
    );
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
    for (const column of within(footer).getAllByRole("navigation")) {
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
