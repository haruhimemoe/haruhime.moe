/**
 * @file tests/unit/tooling/env-example.test.ts
 * @desc .env.example documents every server variable and every optional one, ships no secret
 *       values, lists the required ones first in schema order, and gives the osu! callback URL
 *       better-auth really serves (/api/auth/callback/osu).
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { OPTIONAL_ENV_KEYS, SERVER_ENV_KEYS } from "@/env";

const text = readFileSync(path.join(process.cwd(), ".env.example"), "utf8");

describe(".env.example", () => {
  it.each([...SERVER_ENV_KEYS, ...OPTIONAL_ENV_KEYS])("documents %s", (key) => {
    expect(text).toMatch(new RegExp(`^${key}=`, "m"));
  });

  it.each(["MONGODB_URI", "BETTER_AUTH_SECRET", "OSU_CLIENT_SECRET", "HUB_COOKIE_DOMAIN"])(
    "leaves %s empty",
    (key) => {
      expect(text).toMatch(new RegExp(`^${key}=$`, "m"));
    },
  );

  it("lists the required server variables first, in schema order", () => {
    const assigned = [...text.matchAll(/^([A-Z][A-Z0-9_]*)=/gm)].map((match) => match[1]);
    expect(assigned.slice(0, SERVER_ENV_KEYS.length)).toEqual(SERVER_ENV_KEYS);
  });

  it("gives the osu! callback path", () => {
    expect(text).toContain("{BETTER_AUTH_URL}/api/auth/callback/osu");
  });
});
