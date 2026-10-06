/**
 * @file tests/unit/next-config.test.ts
 * @desc next.config's redirects: /discord answers a permanent redirect to the Discord invite, the
 *       one copy of it every repo's link points at.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { expect, it } from "vitest";
import { SITE } from "@/constants/site";
import nextConfig from "../../next.config";

it("redirects /discord to the invite, permanently", async () => {
  const redirects = await nextConfig.redirects?.();
  expect(redirects).toEqual([
    { source: "/discord", destination: "https://discord.gg/bKy9kjMV4y", permanent: true },
  ]);
  expect(SITE.discordUrl).toBe("https://haruhime.moe/discord");
});
