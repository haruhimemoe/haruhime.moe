/**
 * @file tests/components/account/SessionsList.test.tsx
 * @desc SessionsList: this device first and never revocable, another device signed out after a
 *       confirm, "Sign out everywhere else" leaves only this one, a refusal shows the server's
 *       message and keeps the row, and a 404 counts as gone.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SessionsList } from "@/components/account/SessionsList";
import type { SessionRow } from "@/lib/sessions";

const ROWS: SessionRow[] = [
  {
    id: "s1",
    current: true,
    device: "Firefox on Linux",
    signedIn: "Oct 1, 2026",
    lastActive: "Oct 6, 2026",
  },
  {
    id: "s2",
    current: false,
    device: "Safari on iOS",
    signedIn: "Sep 30, 2026",
    lastActive: "Oct 2, 2026",
  },
  {
    id: "s3",
    current: false,
    device: "Chrome on Windows",
    signedIn: "Sep 1, 2026",
    lastActive: "Sep 2, 2026",
  },
];

const respond = (status: number, body?: unknown) =>
  vi.fn(async () =>
    body === undefined ? new Response(null, { status }) : Response.json(body, { status }),
  );

describe("SessionsList", () => {
  it("marks this device and offers sign-out only for the others", () => {
    render(<SessionsList initial={ROWS} fetcher={respond(204)} />);
    expect(screen.getByText("This device")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Sign out" })).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Sign out everywhere else" })).toBeInTheDocument();
  });

  it("signs one device out after a confirm", async () => {
    const fetcher = respond(204);
    render(<SessionsList initial={ROWS} fetcher={fetcher} />);
    const user = userEvent.setup();
    await user.click(screen.getAllByRole("button", { name: "Sign out" })[0] as HTMLElement);
    await user.click(screen.getByRole("button", { name: "Yes, sign out" }));
    expect(fetcher).toHaveBeenCalledWith("/api/account/sessions/s2", { method: "DELETE" });
    expect(screen.queryByText("Safari on iOS")).not.toBeInTheDocument();
    expect(screen.getByText("Signed out of that device.")).toBeInTheDocument();
  });

  it("signs out everywhere else", async () => {
    const fetcher = respond(200, { revoked: 2 });
    render(<SessionsList initial={ROWS} fetcher={fetcher} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Sign out everywhere else" }));
    await user.click(screen.getByRole("button", { name: "Yes, sign them out" }));
    expect(fetcher).toHaveBeenCalledWith("/api/account/sessions", { method: "DELETE" });
    expect(screen.getByText("Firefox on Linux")).toBeInTheDocument();
    expect(screen.queryByText("Chrome on Windows")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Sign out everywhere else" }),
    ).not.toBeInTheDocument();
  });

  it("treats a 404 as already gone", async () => {
    render(<SessionsList initial={ROWS} fetcher={respond(404, { error: { message: "gone" } })} />);
    const user = userEvent.setup();
    await user.click(screen.getAllByRole("button", { name: "Sign out" })[1] as HTMLElement);
    await user.click(screen.getByRole("button", { name: "Yes, sign out" }));
    expect(screen.queryByText("Chrome on Windows")).not.toBeInTheDocument();
  });

  it("shows a refusal and keeps the row", async () => {
    const fetcher = respond(403, {
      error: { message: "This request has to come from haruhime.moe itself." },
    });
    render(<SessionsList initial={ROWS} fetcher={fetcher} />);
    const user = userEvent.setup();
    await user.click(screen.getAllByRole("button", { name: "Sign out" })[0] as HTMLElement);
    await user.click(screen.getByRole("button", { name: "Yes, sign out" }));
    expect(await screen.findByText(/has to come from haruhime.moe/)).toBeInTheDocument();
    expect(screen.getByText("Safari on iOS")).toBeInTheDocument();
  });
});
