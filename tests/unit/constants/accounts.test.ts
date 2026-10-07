/**
 * @file tests/unit/constants/accounts.test.ts
 * @desc The hub's config: trusted origins are HUB_HOSTS over https, every host is haruhime.moe or
 *       one of its subdomains, and /account's connected apps are exactly the live tools.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { describe, expect, it } from "vitest";
import { CONNECTED_APPS, HUB_HOSTS, SIGNED_IN_COOKIE, TRUSTED_ORIGINS } from "@/constants/accounts";
import { TOOLS } from "@/constants/tools";

describe("accounts", () => {
  it("shares one marker cookie with every app", () => {
    expect(SIGNED_IN_COOKIE).toBe("haruhime-signed-in");
  });

  it("trusts each hub host over https only", () => {
    expect(TRUSTED_ORIGINS).toEqual(HUB_HOSTS.map((host) => `https://${host}`));
    for (const host of HUB_HOSTS) expect(host).toMatch(/^(?:[a-z]+\.)?haruhime\.moe$/);
  });

  it("lists every live tool as a connected app", () => {
    const live = TOOLS.filter((tool) => tool.url).map((tool) => [tool.name, tool.url]);
    expect(CONNECTED_APPS.map((app) => [app.name, app.url])).toEqual(live);
    for (const app of CONNECTED_APPS) expect(HUB_HOSTS).toContain(new URL(app.url).hostname);
  });
});
