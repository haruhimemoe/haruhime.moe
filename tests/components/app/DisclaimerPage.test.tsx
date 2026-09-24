/**
 * @file tests/components/app/DisclaimerPage.test.tsx
 * @desc /disclaimer: title, one h1, the required clauses, last-updated date.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DisclaimerPage, { metadata } from "@/app/disclaimer/page";
import { DISCLAIMER_UPDATED } from "@/constants/legal";

describe("/disclaimer", () => {
  it("has its title and one h1", () => {
    expect(metadata.title).toBe("Disclaimer");
    render(<DisclaimerPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1, name: "Disclaimer" })).toBeInTheDocument();
  });

  it("keeps every clause that protects us", () => {
    render(<DisclaimerPage />);
    expect(screen.getByText(/not affiliated with or endorsed by ppy Pty Ltd/)).toBeInTheDocument();
    expect(screen.getByText(/osu! API and the hinai beatmap mirror/)).toBeInTheDocument();
    expect(screen.getByText(/under each one's terms/)).toBeInTheDocument();
    expect(screen.getByText(/Beatmaps belong to their mappers/)).toBeInTheDocument();
    expect(screen.getByText(/their artists/)).toBeInTheDocument();
    expect(screen.getByText(/provided as is/)).toBeInTheDocument();
  });

  it("shows the last-updated date", () => {
    const { container } = render(<DisclaimerPage />);
    expect(screen.getByText(/Last updated/)).toHaveTextContent("Last updated September 23, 2026");
    expect(container.querySelector("time")).toHaveAttribute("dateTime", DISCLAIMER_UPDATED);
  });
});
