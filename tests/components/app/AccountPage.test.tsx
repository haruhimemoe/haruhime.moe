/**
 * @file tests/components/app/AccountPage.test.tsx
 * @desc /account: never indexed, one h1, the osu! profile (name linked, id shown), the connected
 *       apps with Discord still to come, the sessions card, and the delete form for this user.
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

  it("lists the connected apps and Discord to come", async () => {
    render(await AccountPage());
    for (const name of ["packs", "pools", "bb"]) {
      expect(screen.getByRole("link", { name })).toHaveAttribute(
        "href",
        `https://${name}.haruhime.moe`,
      );
    }
    expect(screen.getByText(/Discord account is coming soon/)).toBeInTheDocument();
  });

  it("shows the sessions and the delete form", async () => {
    render(await AccountPage());
    expect(screen.getByText("This device")).toBeInTheDocument();
    expect(screen.getByText("Delete haruhime")).toBeInTheDocument();
  });
});
