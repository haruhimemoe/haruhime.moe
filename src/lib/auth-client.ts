/**
 * @file src/lib/auth-client.ts
 * @desc better-auth browser client with the osu! user fields typed, no refetch on focus.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

"use client";

import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { Auth } from "@/lib/auth";

/** better-auth's browser client, with the hub's user fields typed and no refetch on focus. */
export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<Auth>()],
  sessionOptions: { refetchOnWindowFocus: false },
});
