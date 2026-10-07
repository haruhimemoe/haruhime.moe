/**
 * @file tests/components/app/AccountPage.test.tsx
 * @desc /account: never indexed, one h1, the osu! profile (name linked, id shown), the connected
 *       apps, Discord only when configured, Download my data, the sessions card, and the delete form for this user.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const USER = {
  id: "u1",
  osuId: 1234567,
  username: "haruhime",
  avatarUrl: "https://a.ppy.sh/1234567",
  sessionId: "s1",
};

vi.mock("@/lib/auth-session", () => ({ requireUser: async () => USER }));
vi.mock("@/lib/sessions", () => ({
  listSessionRows: async () => [
    {
      id: "s1",
      current: true,
      device: "Firefox on Linux",
      signedIn: "Oct 1, 2026",
      lastActive: "Oct 6, 2026",
    },
  ],
}));
const discord = vi.hoisted(() => ({ enabled: false, name: null as string | null }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: () => {} }) }));
vi.mock("@/lib/discord", () => ({
  discordEnabled: () => discord.enabled,
  linkedDiscord: async () => discord.name,
}));
vi.mock("@/lib/account", () => ({
  RestoreSignedIn: () => null,
  SignOutButton: () => <button type="button">Sign out</button>,
  DeleteAccountForm: ({ username }: { username: string }) => <p>Delete {username}</p>,
}));

const { default: AccountPage, metadata } = await import("@/app/account/page");

describe("/account", () => {
  it("is never indexed and has one h1", async () => {
    expect(metadata.robots).toMatchObject({ index: false });
    render(await AccountPage());
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("shows the osu! profile", async () => {
    render(await AccountPage());
    expect(screen.getByRole("link", { name: "haruhime" })).toHaveAttribute(
      "href",
      "https://osu.ppy.sh/users/1234567",
    );
    expect(screen.getByText("osu! ID 1234567")).toBeInTheDocument();
  });

  it("hides Discord while it isn't configured", async () => {
    discord.enabled = false;
    render(await AccountPage());
    expect(screen.queryByText("Discord")).not.toBeInTheDocument();
  });

  it("offers Connect, or the linked name with Unlink", async () => {
    discord.enabled = true;
    discord.name = null;
    const { unmount } = render(await AccountPage());
    expect(screen.getByRole("button", { name: "Connect" })).toBeInTheDocument();
    unmount();
    discord.name = "haru";
    render(await AccountPage());
    expect(screen.getByText("Linked as haru.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Unlink" })).toBeInTheDocument();
    discord.enabled = false;
  });

  it("links Download my data", async () => {
    render(await AccountPage());
    expect(screen.getByRole("link", { name: "Download my data" })).toHaveAttribute(
      "href",
      "/api/account/export",
    );
  });

  it("lists the connected apps", async () => {
    render(await AccountPage());
    for (const name of ["packs", "pools", "bb"]) {
      expect(screen.getByRole("link", { name })).toHaveAttribute(
        "href",
        `https://${name}.haruhime.moe`,
      );
    }
  });

  it("shows the sessions and the delete form", async () => {
    render(await AccountPage());
    expect(screen.getByText("This device")).toBeInTheDocument();
    expect(screen.getByText("Delete haruhime")).toBeInTheDocument();
  });
});
