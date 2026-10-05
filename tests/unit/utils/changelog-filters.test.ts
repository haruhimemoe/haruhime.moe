/**
 * @file tests/unit/utils/changelog-filters.test.ts
 * @desc changelogFilterItems: every filter listed, in order, only the current one marked.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Oct 5, 2026
 * @modified Mon Oct 5, 2026
 */

import { describe, expect, it } from "vitest";
import { CHANGELOG_FILTERS } from "@/constants/changelogs";
import { changelogFilterItems } from "@/utils/changelog-filters";

describe("changelogFilterItems", () => {
  it("lists every filter and marks only the current one", () => {
    const items = changelogFilterItems("/changelog/kind/packages");
    expect(items.map((i) => i.href)).toEqual(CHANGELOG_FILTERS.map((f) => f.href));
    expect(items.filter((i) => i.current).map((i) => i.label)).toEqual(["Packages"]);
  });
});
