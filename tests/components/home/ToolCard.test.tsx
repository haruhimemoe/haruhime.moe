/**
 * @file tests/components/home/ToolCard.test.tsx
 * @desc ToolCard: a live tool links to its site, labeled "beta" while in beta; a coming-soon tool
 *       says so and links nowhere.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Fri Sep 25, 2026
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ToolCard } from "@/components/home/ToolCard";
import type { Tool } from "@/constants/tools";

const live: Tool = {
  name: "packs",
  hue: 333,
  tagline: "osu! beatmap packs for tournament hosts",
  icon: "brand/packs-icon.svg",
  url: "https://packs.haruhime.moe",
};
const beta: Tool = {
  name: "pools",
  hue: 200,
  tagline: "osu! mappools for tournament hosts",
  icon: "brand/pools-icon.svg",
  url: "https://pools.haruhime.moe",
  beta: true,
};
const soon: Tool = {
  name: "sheets",
  hue: 150,
  tagline: "osu! tournament sheets",
  icon: "brand/sheets-icon.svg",
};

const renderCard = (tool: Tool) =>
  render(
    <ul>
      <ToolCard tool={tool} />
    </ul>,
  );

describe("ToolCard", () => {
  it("links a live tool by name and shows its tagline and icon", () => {
    const { container } = renderCard(live);
    expect(screen.getByRole("link", { name: "packs" })).toHaveAttribute(
      "href",
      "https://packs.haruhime.moe",
    );
    expect(screen.getByRole("heading", { level: 3, name: "packs" })).toBeInTheDocument();
    expect(screen.getByText(live.tagline)).toBeInTheDocument();
    expect(container.querySelector("img")).toHaveAttribute("src", "/brand/packs-icon.svg");
    expect(screen.queryByText("coming soon")).not.toBeInTheDocument();
    expect(screen.queryByText("beta")).not.toBeInTheDocument();
  });

  it("labels a live beta tool beta, outside its link", () => {
    renderCard(beta);
    const link = screen.getByRole("link", { name: "pools" });
    expect(link).toHaveAttribute("href", "https://pools.haruhime.moe");
    expect(screen.getByText("beta")).toBeInTheDocument();
    expect(link).not.toContainElement(screen.getByText("beta"));
    expect(screen.queryByText("coming soon")).not.toBeInTheDocument();
  });

  it("marks an unreleased tool coming soon, with no link", () => {
    const { container } = renderCard(soon);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "sheets" })).toBeInTheDocument();
    expect(screen.getByText(soon.tagline)).toBeInTheDocument();
    expect(screen.getByText("coming soon")).toBeInTheDocument();
    expect(container.querySelector("img")).toHaveAttribute("src", "/brand/sheets-icon.svg");
  });

  it("gives the icon empty alt text, since the name is right next to it", () => {
    const { container } = renderCard(live);
    expect(container.querySelector("img")).toHaveAttribute("alt", "");
  });
});
