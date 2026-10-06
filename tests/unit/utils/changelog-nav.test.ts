/**
 * @file tests/unit/utils/changelog-nav.test.ts
 * @desc changelogNavGroups: Apps, Packages and Claude plugin in order, each kind's feed first
 *       where it has one, every repo's page with its latest version as the badge, none without.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { describe, expect, it } from "vitest";
import { CHANGELOG_SOURCES } from "@/constants/changelogs";
import { changelogNavGroups } from "@/utils/changelog-nav";

describe("changelogNavGroups", () => {
  const groups = changelogNavGroups(new Map([["ui", "0.19.0"]]));

  it("groups Apps, Packages, then Claude plugin, each feed first", () => {
    expect(groups.map((g) => g.heading)).toEqual(["Apps", "Packages", "Claude plugin"]);
    expect(groups[0]?.items[0]).toEqual({ href: "/changelog/kind/apps", title: "All apps" });
    expect(groups[1]?.items[0]).toEqual({
      href: "/changelog/kind/packages",
      title: "All packages",
    });
    expect(groups[2]?.items).toEqual([
      {
        href: "/changelog/claude-plugin",
        title: "Claude plugin changelog",
        navTitle: "claude-plugin",
      },
    ]);
  });

  it("lists every repo once, a badge only where a version is known", () => {
    const repos = groups.flatMap((g) => g.items).filter((i) => !i.href.includes("/kind/"));
    expect(repos.map((i) => i.href)).toEqual(CHANGELOG_SOURCES.map((s) => `/changelog/${s.slug}`));
    expect(repos.find((i) => i.href === "/changelog/ui")).toEqual({
      href: "/changelog/ui",
      title: "ui changelog",
      navTitle: "ui",
      badge: "0.19.0",
    });
    expect(repos.filter((i) => i.badge)).toHaveLength(1);
  });
});
