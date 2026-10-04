/**
 * @file tests/components/showcase/UtilityDemos.test.tsx
 * @desc UtilityDemos: cx's merged output, printed under its input in a CodeBlock (an async
 *       Server Component, so the demos render inside Suspense under `act`, the way
 *       Markdown.test.tsx does).
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Sep 28, 2026
 * @modified Sun Oct 4, 2026
 */

import { act, render, screen } from "@testing-library/react";
import { Suspense } from "react";
import { describe, expect, it } from "vitest";
import { UtilityDemos } from "@/components/showcase/UtilityDemos";

/** UtilityDemos shows CodeBlock, an async Server Component: render it inside Suspense under act. */
const renderDemos = async () => {
  let result!: ReturnType<typeof render>;
  await act(async () => {
    result = render(
      <Suspense fallback={null}>
        <UtilityDemos />
      </Suspense>,
    );
  });
  return result;
};

describe("UtilityDemos", () => {
  it("prints what cx makes of conflicting classes", async () => {
    await renderDemos();
    // findByText: under coverage, act can return before the CodeBlock has resolved.
    expect(await screen.findByText(/"px-2 text-h1"/, {}, { timeout: 5000 })).toBeInTheDocument();
  });
});
