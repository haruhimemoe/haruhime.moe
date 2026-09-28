/**
 * @file tests/components/showcase/OsuDemos.test.tsx
 * @desc OsuDemos: every StarRating reads its value with the unit.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Sep 28, 2026
 * @modified Mon Sep 28, 2026
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
});
