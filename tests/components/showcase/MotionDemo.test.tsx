/**
 * @file tests/components/showcase/MotionDemo.test.tsx
 * @desc /ui's useMotionAllowed demo: says motion is allowed, or reduced when the browser asks.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Sun Oct 4, 2026
 */

import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MotionDemo } from "@/components/showcase/MotionDemo";

const setReduced = (reduced: boolean) =>
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: () => ({ matches: reduced, addEventListener() {}, removeEventListener() {} }),
  });

afterEach(() =>
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: undefined,
  }),
);

describe("MotionDemo", () => {
  it("says motion is allowed", () => {
    setReduced(false);
    render(<MotionDemo />);
    expect(screen.getByText("Your browser allows motion.")).toBeInTheDocument();
  });
  it("says motion is reduced", () => {
    setReduced(true);
    render(<MotionDemo />);
    expect(screen.getByText("Your browser asks for reduced motion.")).toBeInTheDocument();
  });
});
