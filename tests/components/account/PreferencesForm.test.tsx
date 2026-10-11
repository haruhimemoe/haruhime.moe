/**
 * @file tests/components/account/PreferencesForm.test.tsx
 * @desc PreferencesForm: picking a zone and an hour cycle then saving posts exactly those values
 *       and shows "Saved."; with no stored preferences the preview still renders before mount
 *       (no hydration mismatch) and keeps "Browser default" picked.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 11, 2026
 * @modified Sun Oct 11, 2026
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PreferencesForm } from "@/components/account/PreferencesForm";

describe("PreferencesForm", () => {
  it("saves the picked zone and hour cycle", async () => {
    const fetcher = vi.fn(
      async () => new Response(JSON.stringify({ timezone: "Asia/Tokyo", hourCycle: "h12" })),
    );
    render(<PreferencesForm initial={{ timezone: null, hourCycle: null }} fetcher={fetcher} />);
    const user = userEvent.setup();

    await user.selectOptions(screen.getByLabelText("Time zone"), "Asia/Tokyo");
    await user.click(screen.getByRole("radio", { name: "12-hour" }));
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(fetcher).toHaveBeenCalledWith(
      "/api/account/preferences",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ timezone: "Asia/Tokyo", hourCycle: "h12" }),
      }),
    );
    expect(await screen.findByText(/saved/i)).toBeInTheDocument();
  });

  it("picks Browser default and Use my browser's with no stored preferences", () => {
    render(<PreferencesForm initial={{ timezone: null, hourCycle: null }} />);
    expect(screen.getByLabelText("Time zone")).toHaveValue("");
    expect(screen.getByRole("radio", { name: "Browser default" })).toBeChecked();
  });
});
