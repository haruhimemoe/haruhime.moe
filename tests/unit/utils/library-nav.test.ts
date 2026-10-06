/**
 * @file tests/unit/utils/library-nav.test.ts
 * @desc libraryNavGroups: one Packages group, every library's docs page in LIBRARIES order with
 *       its short name, its npm name as the title, and its version as the badge when known.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { expect, it } from "vitest";
import { LIBRARIES } from "@/constants/libraries";
import { libraryNavGroups } from "@/utils/library-nav";

it("lists every library under Packages, a badge only where npm answered", () => {
  const [group, ...rest] = libraryNavGroups(new Map([["vcs", "0.1.0"]]));
  expect(rest).toEqual([]);
  expect(group?.heading).toBe("Packages");
  expect(group?.items.map((i) => i.href)).toEqual(LIBRARIES.map((l) => `/libraries/${l.name}`));
  expect(group?.items.find((i) => i.navTitle === "vcs")).toEqual({
    href: "/libraries/vcs",
    title: "@haruhimemoe/vcs",
    navTitle: "vcs",
    badge: "0.1.0",
  });
  expect(group?.items.filter((i) => i.badge)).toHaveLength(1);
});
