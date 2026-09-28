/**
 * @file tests/components/showcase/FormDemos.test.tsx
 * @desc FormDemos: RadioGroup with a default, a disabled option and a group error.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Sep 28, 2026
 * @modified Mon Sep 28, 2026
 */

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FormDemos } from "@/components/showcase/FormDemos";

describe("FormDemos", () => {
  it("shows RadioGroup with a default, a disabled option and an error", () => {
    render(<FormDemos />);
    const who = screen.getByRole("group", { name: "Who can see it" });
    expect(within(who).getByRole("radio", { name: /Unlisted/ })).toBeChecked();
    const download = screen.getByRole("group", { name: "Download as" });
    expect(within(download).getByRole("radio", { name: /Torrent/ })).toBeDisabled();
    expect(download).toHaveTextContent("Pick how to download the pack.");
  });
});
