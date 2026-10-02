/**
 * @file tests/components/home/EgcBanner.test.tsx
 * @desc EgcBanner: names Evergreen Cup with its line, links evergreencup.org in a new tab as the
 *       card's one link, shows the skyline poster right away, and mounts the looping video only
 *       when the visitor hasn't asked for reduced motion.
 * @author David @dvhsh (https://dvh.sh)
 * @created Fri Oct 2, 2026
 * @modified Fri Oct 2, 2026
 */

import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EgcBanner } from "@/components/home/EgcBanner";
import { EVERGREEN_CUP } from "@/constants/site";

/** Stubs window.matchMedia so "(prefers-reduced-motion: reduce)" matches or not. */
function stubReducedMotion(reduce: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: query.includes("reduce") && reduce,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("EgcBanner", () => {
  it("names Evergreen Cup, its line, and links the site in a new tab", () => {
    stubReducedMotion(false);
    render(<EgcBanner />);
    expect(screen.getByText(EVERGREEN_CUP.name)).toBeInTheDocument();
    expect(screen.getByText(EVERGREEN_CUP.line)).toBeInTheDocument();
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", EVERGREEN_CUP.url);
    expect(links[0]).toHaveAttribute("target", "_blank");
    expect(links[0]).toHaveAttribute("rel", "noopener");
  });

  it("shows the poster and a muted looping video when motion is fine", () => {
    stubReducedMotion(false);
    const { container } = render(<EgcBanner />);
    expect(container.querySelector("img")).toHaveAttribute("src", "/egc/skyline-poster.webp");
    const video = container.querySelector("video");
    expect(video).not.toBeNull();
    expect(video).toHaveAttribute("loop");
    expect(video).toHaveAttribute("autoplay");
    expect(video).toHaveAttribute("playsinline");
    expect(video?.muted).toBe(true);
    const sources = [...container.querySelectorAll("source")].map((s) => s.getAttribute("src"));
    expect(sources).toEqual(["/egc/skyline.webm", "/egc/skyline.mp4"]);
  });

  it("leaves the video out under prefers-reduced-motion", () => {
    stubReducedMotion(true);
    const { container } = render(<EgcBanner />);
    expect(container.querySelector("img")).toBeInTheDocument();
    expect(container.querySelector("video")).toBeNull();
  });

  it("keeps the art decorative: empty alt on the poster, no controls on the video", () => {
    stubReducedMotion(false);
    const { container } = render(<EgcBanner />);
    expect(container.querySelector("img")).toHaveAttribute("alt", "");
    expect(container.querySelector("video")).not.toHaveAttribute("controls");
  });
});
