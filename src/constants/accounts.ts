/**
 * @file src/constants/accounts.ts
 * @desc The accounts hub's static config. haruhime.moe is the only app that runs osu! sign-in and
 *       issues sessions; packs, pools and bb read them. HUB_HOSTS is the exact-hostname allowlist
 *       a satellite's absolute `?next=` must match (next-kit's safeAbsoluteNext: never a suffix
 *       match), TRUSTED_ORIGINS the same hosts as better-auth's trustedOrigins, so sign-in may
 *       land back on them. CONNECTED_APPS is /account's list of the apps one account opens.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { AccountApp } from "@haruhimemoe/next-kit/account";
import { SHARED_MARKER_COOKIE } from "@haruhimemoe/next-kit/auth-react";

/** The readable "signed in" marker, shared by the hub and every satellite. */
export const SIGNED_IN_COOKIE = SHARED_MARKER_COOKIE;

/** Where sign-in lands without a (safe) `next`. */
export const DEFAULT_AFTER_SIGN_IN = "/account";

/** The hosts sign-in may send a visitor back to, matched exactly. */
export const HUB_HOSTS: readonly string[] = [
  "haruhime.moe",
  "www.haruhime.moe",
  "packs.haruhime.moe",
  "pools.haruhime.moe",
  "bb.haruhime.moe",
];

/** HUB_HOSTS as https origins, for better-auth's trustedOrigins. */
export const TRUSTED_ORIGINS: readonly string[] = HUB_HOSTS.map((host) => `https://${host}`);

/** One app a haruhime account signs in to. */
export type ConnectedApp = { name: string; url: string; line: string };

/** The apps /account lists, in TOOLS order (sheets joins when it launches). */
export const CONNECTED_APPS: readonly ConnectedApp[] = [
  { name: "packs", url: "https://packs.haruhime.moe", line: "Your packs and downloads." },
  { name: "pools", url: "https://pools.haruhime.moe", line: "The pools you make and edit." },
  { name: "bb", url: "https://bb.haruhime.moe", line: "Your saved BBCode and templates." },
];

/**
 * The apps account export, delete and the inbox fan out to, each with the env var holding its
 * secret (that app's ACCOUNT_FANOUT_SECRET).
 */
export const ACCOUNT_APPS: readonly AccountApp[] = [
  { id: "bb", name: "bb", baseUrl: "https://bb.haruhime.moe", secretEnv: "ACCOUNT_SECRET_BB" },
  {
    id: "packs",
    name: "packs",
    baseUrl: "https://packs.haruhime.moe",
    secretEnv: "ACCOUNT_SECRET_PACKS",
  },
  {
    id: "pools",
    name: "pools",
    baseUrl: "https://pools.haruhime.moe",
    secretEnv: "ACCOUNT_SECRET_POOLS",
  },
];

/** The locales the hub serves: English only for now. */
export const HUB_LOCALES = { locales: ["en"], defaultLocale: "en" } as const;

/** The header's account menu links; Sign out comes after them. */
export const ACCOUNT_MENU_ITEMS: readonly { href: string; label: string }[] = [
  { href: "/account", label: "Account" },
];
