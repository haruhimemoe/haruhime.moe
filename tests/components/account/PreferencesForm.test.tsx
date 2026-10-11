/**
 * @file tests/components/account/PreferencesForm.test.tsx
 * @desc PreferencesForm: picking a zone and an hour cycle then saving posts exactly those values
 *       and shows "Saved."; with no stored preferences the preview still renders before mount
 *       (no hydration mismatch) and keeps "Default (12-hour)" picked. Server markup (rendered
 *       with no effects, same as Next's SSR pass) shows no zone options beyond the stored one
 *       and no formatted preview text, matching what the first client render must also show. A
 *       stored alias zone that Intl.supportedValuesOf doesn't list stays selectable after mount.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 11, 2026
 * @modified Sun Oct 11, 2026
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";
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

  it("picks Default (12-hour) and Use my browser's with no stored preferences", () => {
    render(<PreferencesForm initial={{ timezone: null, hourCycle: null }} />);
    expect(screen.getByLabelText("Time zone")).toHaveValue("");
    expect(screen.getByRole("radio", { name: "Default (12-hour)" })).toBeChecked();
  });

  it("renders server markup with no zone options beyond the stored one and no preview text", () => {
    const html = renderToStaticMarkup(
      <PreferencesForm initial={{ timezone: "Asia/Tokyo", hourCycle: null }} />,
    );
    const optionValues = [...html.matchAll(/<option value="([^"]*)"/g)].map((m) => m[1]);
    expect(optionValues).toEqual(["", "Asia/Tokyo"]);
    expect(html).not.toMatch(/Preview: \d/);
    expect(html).toContain("Preview: loading");
  });

  it("keeps a stored alias zone as an option even when supportedValuesOf doesn't list it", async () => {
    render(<PreferencesForm initial={{ timezone: "US/Pacific", hourCycle: null }} />);
    expect(Intl.supportedValuesOf("timeZone").includes("US/Pacific")).toBe(false);
    const options = (await screen.findAllByRole("option")).map(
      (option) => (option as HTMLOptionElement).value,
    );
    expect(options).toContain("US/Pacific");
  });
});
