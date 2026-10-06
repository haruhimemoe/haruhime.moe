/**
 * @file src/content/owner.ts
 * @desc haruhime's own osu! player card for the homepage: a snapshot read from osu! by hand on
 *       Tue Oct 6, 2026, in the same shape as the /thanks cards. The site never calls osu!.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { ThanksPlayer } from "@/content/thanks";

/** haruhime's osu! account as of the snapshot, with the card's bottom line. */
export const OWNER: ThanksPlayer = {
  username: "Haruhime",
  role: "hellosu idk what to put here",
  osu: {
    id: 12231334,
    country: "US",
    cover:
      "https://assets.ppy.sh/user-profile-covers/12231334/743b25a97c65301c1789bddb1ffc01aabda751d2e098e986231f2d18bd0038a5.png",
    team: {
      name: "EasyNightcore",
      flag: "https://assets.ppy.sh/teams/flag/4631/d7ed6803bba219dba9880fa334dc5213561d3425d1d20b4f544b8eaf43aea7d3.png",
    },
    supporter: true,
  },
};
