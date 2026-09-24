/**
 * @file tests/components/app/UiPage.test.tsx
 * @desc /ui: title, one h1, the intro links and which sites the lead says use the kit, every group
 *       heading, a demo for every component @haruhimemoe/ui exports, the states each demo promises,
 *       a working filter panel (Clear filters shows for any filter, the length maximum included),
 *       and no axe violations.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

import * as ui from "@haruhimemoe/ui";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import UiPage, { metadata } from "@/app/ui/page";
import { expectNoAxeViolations } from "../../helpers/axe";

const GROUPS = ["Basics", "Forms", "Actions", "Icons", "Filters", "Shell"];

/** The demo block under a component's h3: the h3's wrapper's parent holds the example box. */
const demo = (name: string): HTMLElement => {
  const heading = screen.getByRole("heading", { level: 3, name });
  const block = heading.parentElement?.parentElement;
  if (!block) throw new Error(`no demo block for ${name}`);
  return block;
};

describe("/ui", () => {
  it("has its title and one h1", () => {
    expect(metadata.title).toBe("UI");
    expect(metadata.description).toMatch(/@haruhimemoe\/ui/);
    render(<UiPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1, name: "UI" })).toBeInTheDocument();
  });

  it("links the package on npm and its source on GitHub", () => {
    render(<UiPage />);
    expect(screen.getByRole("link", { name: "@haruhimemoe/ui" })).toHaveAttribute(
      "href",
      "https://www.npmjs.com/package/@haruhimemoe/ui",
    );
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/haruhimemoe/ui",
    );
    expect(screen.getByText(/^Version \d+\.\d+\.\d+, MIT license/)).toBeInTheDocument();
  });

  it("says haruhime.moe is built from the kit and packs is moving to it", () => {
    render(<UiPage />);
    const lead = screen.getByRole("link", { name: "@haruhimemoe/ui" }).closest("p");
    expect(lead).toHaveTextContent("haruhime.moe is built from it, and packs is moving to it.");
    expect(lead).not.toHaveTextContent(/packs (is|are) built from/);
  });

  it("has every group heading, linked from the page's own nav", () => {
    render(<UiPage />);
    const onThisPage = screen.getByRole("navigation", { name: "On this page" });
    for (const name of GROUPS) {
      const heading = screen.getByRole("heading", { level: 2, name });
      expect(within(onThisPage).getByRole("link", { name })).toHaveAttribute(
        "href",
        `#${heading.id}`,
      );
      expect(screen.getByRole("region", { name })).toContainElement(heading);
    }
  });

  it("has a demo for every component the package exports", () => {
    render(<UiPage />);
    const exported = Object.keys(ui).sort();
    expect(exported.length).toBeGreaterThan(20);
    for (const name of exported) {
      expect(screen.getByRole("heading", { level: 3, name })).toBeInTheDocument();
    }
  });

  it("shows every button variant and size, and disabled ones", () => {
    render(<UiPage />);
    const buttons = within(demo("Button")).getAllByRole("button");
    expect(buttons.map((b) => b.textContent)).toEqual([
      "Primary",
      "Secondary",
      "Ghost",
      "Primary",
      "Secondary",
      "Ghost",
      "Primary",
      "Secondary",
      "Ghost",
    ]);
    expect(buttons.filter((b) => b.hasAttribute("disabled"))).toHaveLength(3);
  });

  it("shows ButtonLink as an internal link and an external one in a new tab", () => {
    render(<UiPage />);
    const links = within(demo("ButtonLink"));
    expect(links.getByRole("link", { name: "Brand page" })).toHaveAttribute("href", "/brand");
    const external = links.getByRole("link", { name: "Source on GitHub (new tab)" });
    expect(external).toHaveAttribute("target", "_blank");
    expect(external).toHaveAttribute("rel", "noreferrer");
  });

  it("shows a card with and without a title, and every notice tone", () => {
    render(<UiPage />);
    expect(screen.getByRole("region", { name: "A card with a title" })).toBeInTheDocument();
    expect(screen.getByText(/A card without a title/)).toBeInTheDocument();
    const notices = within(demo("Notice"));
    for (const text of [/^Info:/, /^Warning:/, /^Error:/, /couldn't be added/]) {
      expect(notices.getByText(text)).toBeInTheDocument();
    }
  });

  it("shows every form field with a hint, and with an error", () => {
    render(<UiPage />);
    for (const [label, hint, error] of [
      ["Link name", "Letters, numbers and dashes.", "Use letters, numbers and dashes only."],
      ["Beatmap ids", "One per line.", "abc isn't a beatmap id."],
      ["Sort by", "How the list is ordered.", "Pick an order."],
    ] as const) {
      const field = screen.getByLabelText(label);
      expect(field).toHaveAttribute("aria-invalid", "true");
      expect(field).toHaveAccessibleDescription(`${hint} ${error}`);
    }
    for (const [label, hint] of [
      ["Pack name", "Shown on the pack page."],
      ["Notes", "Anyone with the link can read these."],
      ["Game mode", "Which ruleset the pool is for."],
    ] as const) {
      const field = screen.getByLabelText(label, { selector: "input, textarea, select" });
      expect(field).not.toHaveAttribute("aria-invalid", "true");
      expect(field).toHaveAccessibleDescription(hint);
    }
    expect(screen.getByRole("checkbox", { name: "Public" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "I read the rules" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByRole("combobox", { name: "Move to" })).toBeInTheDocument();
  });

  it("shows pagination on the first, a middle and the last page", () => {
    render(<UiPage />);
    const first = screen.getByRole("navigation", { name: "Pages, first page example" });
    expect(within(first).queryByRole("link", { name: "Previous" })).not.toBeInTheDocument();
    expect(within(first).getByRole("link", { name: "Next" })).toHaveAttribute(
      "href",
      "/ui?page=2#actions",
    );
    const middle = screen.getByRole("navigation", { name: "Pages, middle page example" });
    expect(within(middle).getAllByRole("link")).toHaveLength(2);
    expect(middle).toHaveTextContent("Page 3 of 5");
    const last = screen.getByRole("navigation", { name: "Pages, last page example" });
    expect(within(last).queryByRole("link", { name: "Next" })).not.toBeInTheDocument();
  });

  it("carries JSON-LD for the package", () => {
    const { container } = render(<UiPage />);
    const ld = JSON.parse(
      container.querySelector('script[type="application/ld+json"]')?.textContent ?? "{}",
    );
    expect(ld).toMatchObject({
      "@context": "https://schema.org",
      "@type": "SoftwareSourceCode",
      name: "@haruhimemoe/ui",
      codeRepository: "https://github.com/haruhimemoe/ui",
    });
  });

  it("shows the wordmark, its link, and the GitHub icon in a named link", () => {
    render(<UiPage />);
    expect(
      within(demo("HaruhimeWordmark")).getAllByRole("img", { name: "haruhime.moe" }),
    ).toHaveLength(2);
    expect(
      within(demo("HaruhimeWordmarkLink")).getByRole("link", { name: "haruhime.moe" }),
    ).toHaveAttribute("href", "https://www.haruhime.moe");
    expect(screen.getByRole("link", { name: "@haruhimemoe/ui on GitHub" })).toBeInTheDocument();
  });

  it("shows an open-ended range and an m:ss one", () => {
    render(<UiPage />);
    const sliders = within(demo("RangeSlider"));
    const stars = sliders.getByRole("group", { name: "Star rating" });
    expect(within(stars).getByRole("textbox", { name: "Maximum Star rating" })).toHaveValue("10+");
    const length = sliders.getByRole("group", { name: "Length" });
    expect(within(length).getByRole("textbox", { name: "Minimum Length" })).toHaveValue("1:00");
    expect(within(length).getByRole("textbox", { name: "Maximum Length" })).toHaveValue("5:00");
    for (const input of within(sliders.getByRole("group", { name: "BPM" })).getAllByRole(
      "textbox",
    )) {
      expect(input).toBeDisabled();
    }
  });

  it("toggles chips", () => {
    render(<UiPage />);
    const loved = within(demo("Chip")).getByRole("button", { name: "Loved" });
    expect(loved).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(loved);
    expect(loved).toHaveAttribute("aria-pressed", "false");

    const mods = within(demo("ChipGroup"));
    expect(mods.getByText("Picked: HD, DT")).toBeInTheDocument();
    fireEvent.click(mods.getByRole("button", { name: "FL" }));
    expect(mods.getByText("Picked: HD, DT, FL")).toBeInTheDocument();
    expect(mods.getByRole("button", { name: "EZ" })).toBeDisabled();
  });

  it("filters the sample pool with a live count, and clears", () => {
    render(<UiPage />);
    const panel = screen.getByRole("region", { name: "Sample pool" });
    const count = within(panel).getByText("14 of 14 slots");
    expect(count.closest("output")).toHaveAttribute("aria-live", "polite");
    expect(within(panel).queryByRole("button", { name: "Clear filters" })).not.toBeInTheDocument();

    fireEvent.click(within(panel).getByRole("button", { name: "DT" }));
    expect(within(panel).getByText("3 of 14 slots")).toBeInTheDocument();
    expect(screen.getByText("Matching: DT1, DT2, DT3")).toBeInTheDocument();

    const maxStars = within(panel).getByRole("textbox", { name: "Maximum Star rating" });
    fireEvent.change(maxStars, { target: { value: "6.5" } });
    fireEvent.blur(maxStars);
    expect(within(panel).getByText("2 of 14 slots")).toBeInTheDocument();

    fireEvent.click(within(panel).getByRole("button", { name: "Clear filters" }));
    expect(within(panel).getByText("14 of 14 slots")).toBeInTheDocument();
    expect(within(panel).queryByRole("button", { name: "Clear filters" })).not.toBeInTheDocument();

    // The length maximum alone is a filter too: it drops TB (5:12), so Clear filters shows.
    const maxLength = within(panel).getByRole("textbox", { name: "Maximum Length" });
    expect(maxLength).toHaveValue("10:00+");
    fireEvent.change(maxLength, { target: { value: "5:00" } });
    fireEvent.blur(maxLength);
    expect(within(panel).getByText("13 of 14 slots")).toBeInTheDocument();
    fireEvent.click(within(panel).getByRole("button", { name: "Clear filters" }));
    expect(within(panel).getByText("14 of 14 slots")).toBeInTheDocument();
    expect(maxLength).toHaveValue("10:00+");
  });

  it("has no axe violations", async () => {
    const { container } = render(<UiPage />);
    await expectNoAxeViolations(container);
  });
});
