/**
 * @file tests/components/showcase/UtilityDemos.test.tsx
 * @desc UtilityDemos: cx's merged output, printed under its input.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Sep 28, 2026
 * @modified Mon Sep 28, 2026
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { UtilityDemos } from "@/components/showcase/UtilityDemos";

describe("UtilityDemos", () => {
  it("prints what cx makes of conflicting classes", () => {
    render(<UtilityDemos />);
    expect(screen.getByText(/"rounded-md px-2 text-h1"/)).toBeInTheDocument();
  });
});
