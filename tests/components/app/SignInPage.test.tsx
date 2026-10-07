/**
 * @file tests/components/app/SignInPage.test.tsx
 * @desc /signin: never indexed, one h1, the osu! button carrying a checked `next` (a satellite URL
 *       kept, a foreign one dropped), an error explained, and a signed-in visitor handed on.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const getCurrentUser = vi.fn();
vi.mock("@/lib/auth-session", () => ({ getCurrentUser: () => getCurrentUser() }));
vi.mock("@/lib/account", () => ({
  SignInWithOsu: ({ next }: { next: string }) => (
    <button type="button" data-next={next}>
      Sign in with osu!
    </button>
  ),
  RestoreSignedIn: ({ next }: { next?: string }) => <p data-testid="restore">{next}</p>,
}));

const { default: SignInPage, metadata } = await import("@/app/signin/page");

const renderPage = async (params: Record<string, string | string[]>) =>
  render(await SignInPage({ searchParams: Promise.resolve(params) } as never));

beforeEach(() => {
  getCurrentUser.mockResolvedValue(null);
});

describe("/signin", () => {
  it("is never indexed and has one h1", async () => {
    expect(metadata.robots).toMatchObject({ index: false });
    await renderPage({});
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("button", { name: "Sign in with osu!" })).toHaveAttribute(
      "data-next",
      "/account",
    );
  });

  it("keeps a satellite's next and drops a foreign one", async () => {
    await renderPage({ next: "https://pools.haruhime.moe/p/abc" });
    expect(screen.getByRole("button")).toHaveAttribute(
      "data-next",
      "https://pools.haruhime.moe/p/abc",
    );
    screen.getByRole("button").remove();
    await renderPage({ next: "https://haruhime.moe.evil.com/" });
    expect(screen.getByRole("button")).toHaveAttribute("data-next", "/account");
  });

  it("explains an error", async () => {
    await renderPage({ error: "access_denied" });
    expect(screen.getByRole("alert")).toHaveTextContent("cancelled on osu!");
  });

  it("hands a signed-in visitor on to next", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1" });
    await renderPage({ next: "https://bb.haruhime.moe/" });
    expect(screen.getByTestId("restore")).toHaveTextContent("https://bb.haruhime.moe/");
  });
});
