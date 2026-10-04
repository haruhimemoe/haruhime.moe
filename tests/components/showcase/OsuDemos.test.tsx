/**
 * @file tests/components/showcase/OsuDemos.test.tsx
 * @desc OsuDemos: every StarRating reads its value with the unit; PlayerCard's four sample states.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Sep 28, 2026
 * @modified Sun Oct 4, 2026
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OsuDemos } from "@/components/showcase/OsuDemos";

describe("OsuDemos", () => {
  it("reads each star rating with its unit", () => {
    render(<OsuDemos />);
    expect(screen.getByText("5.90 stars")).toBeInTheDocument();
    expect(screen.getAllByText(/^\d+\.\d{2} stars$/)).toHaveLength(6);
  });

  it("shows PlayerCard offline, online, with a role and name-only", () => {
    render(<OsuDemos />);
    expect(screen.getByRole("heading", { level: 3, name: "PlayerCard" })).toBeInTheDocument();
    const profiles = screen.getAllByRole("link", { name: "peppy" });
    expect(profiles).toHaveLength(3);
    for (const link of profiles) expect(link).toHaveAttribute("href", "https://osu.ppy.sh/users/2");
    expect(screen.getByText("Offline")).toBeInTheDocument();
    expect(screen.getByText("Online")).toBeInTheDocument();
    expect(screen.getByText("sample player")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "sample player" })).toBeNull();
  });
});
