/**
 * @file tests/components/app/ContactPage.test.tsx
 * @desc /contact: title, one h1, email as text and mailto, the Discord server, GitHub org,
 *       security reports.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Fri Sep 25, 2026
 */

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ContactPage, { metadata } from "@/app/contact/page";

describe("/contact", () => {
  it("has its title and one h1", () => {
    expect(metadata.title).toBe("Contact");
    render(<ContactPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1, name: "Contact" })).toBeInTheDocument();
  });

  it("shows the email as text and as a mailto link", () => {
    render(<ContactPage />);
    const email = screen.getByRole("region", { name: "Email" });
    expect(within(email).getByText("contact@haruhime.moe")).toBeInTheDocument();
    expect(within(email).getByRole("link", { name: "Send an email" })).toHaveAttribute(
      "href",
      "mailto:contact@haruhime.moe",
    );
  });

  it("links the Discord server in the same tab", () => {
    render(<ContactPage />);
    const discord = screen.getByRole("region", { name: "Discord" });
    const link = within(discord).getByRole("link", { name: "discord.gg/bKy9kjMV4y" });
    expect(link).toHaveAttribute("href", "https://discord.gg/bKy9kjMV4y");
    expect(link).not.toHaveAttribute("target");
  });

  it("links the GitHub org and says where security reports go", () => {
    render(<ContactPage />);
    expect(screen.getByRole("link", { name: "github.com/haruhimemoe" })).toHaveAttribute(
      "href",
      "https://github.com/haruhimemoe",
    );
    const security = screen.getByRole("region", { name: "Security" });
    expect(security).toHaveTextContent("contact@haruhime.moe privately");
  });
});
