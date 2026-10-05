/**
 * @file tests/components/showcase/MapDemos.test.tsx
 * @desc /ui's map display demos: one h3 per export, sample data labelled as sample, every
 *       MapCard background, one Copy ID scope, and the preview stop button.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Oct 5, 2026
 * @modified Mon Oct 5, 2026
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MapDemos } from "@/components/showcase/MapDemos";

const NAMES = [
  "MapCard",
  "MapSetCard",
  "MapGroup",
  "MapCover",
  "mapCoverUrl",
  "MAP_STATUS_LABELS",
  "MapPreviewButton",
  "stopMapPreview",
  "MapCopyScope",
];

describe("MapDemos", () => {
  it("has a demo heading per map export", () => {
    render(<MapDemos />);
    for (const name of NAMES) {
      expect(screen.getByRole("heading", { level: 3, name })).toBeInTheDocument();
    }
  });

  it("says the maps are sample data", () => {
    render(<MapDemos />);
    expect(screen.getAllByText(/sample/i).length).toBeGreaterThan(0);
  });

  it("shows MapCard rows and cards over none, cover and blur", () => {
    const { container } = render(<MapDemos />);
    expect(container.querySelectorAll("img.-z-10").length).toBeGreaterThanOrEqual(4);
    expect(container.querySelector("img.blur-xl")).not.toBeNull();
    expect(screen.getAllByRole("button", { name: /^Copy ID \d+/ }).length).toBeGreaterThan(1);
  });

  it("offers a button that stops any preview", () => {
    render(<MapDemos />);
    expect(screen.getByRole("button", { name: "Stop any preview" })).toBeInTheDocument();
  });
});
