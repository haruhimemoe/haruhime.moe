/**
 * @file tests/unit/utils/changelog-feed.test.ts
 * @desc buildFeed: newest date first, then repo label, then file order for same-day releases;
 *       undated releases last; Unreleased never in the feed; a kind filter; the 30-release cap
 *       and its "more" flag; failed sources listed (only those in the filter); only the newest
 *       open. groupByDate: consecutive same-day entries together. latestVersions: each loaded
 *       repo's first release.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Tue Oct 6, 2026
 */

import { describe, expect, it } from "vitest";
import type { ChangelogSource } from "@/constants/changelogs";
import type { Changelog, Release } from "@/utils/changelog";
import {
  buildFeed,
  type ChangelogResult,
  FEED_LIMIT,
  FEED_OPEN,
  groupByDate,
  latestVersions,
} from "@/utils/changelog-feed";

const src = (slug: string, kind: ChangelogSource["kind"] = "package"): ChangelogSource => ({
  slug,
  label: slug,
  repo: slug,
  kind,
});
const rel = (version: string, date: string | null): Release => ({
  version,
  date,
  sections: [{ name: "Added", items: [version] }],
});
const ok = (source: ChangelogSource, releases: Release[]): ChangelogResult => {
  const changelog: Changelog = {
    unreleased: [{ name: "Added", items: ["not yet"] }],
    releases,
    references: ["[x]: https://x.y"],
  };
  return { source, changelog };
};
const names = (results: ChangelogResult[], kind?: ChangelogSource["kind"]) =>
  buildFeed(results, kind).entries.map((e) => `${e.source.slug} ${e.release.version}`);

describe("buildFeed", () => {
  it("sorts by date, then label, keeps same-day releases of one repo in file order", () => {
    const results = [
      ok(src("ui"), [
        rel("0.9.0", "2026-10-03"),
        rel("0.8.0", "2026-10-03"),
        rel("0.1.0", "2026-09-23"),
      ]),
      ok(src("brand"), [rel("0.6.0", "2026-10-03"), rel("0.5.0", null)]),
      ok(src("packs", "app"), [rel("0.1.0", "2026-10-04")]),
    ];
    expect(names(results)).toEqual([
      "packs 0.1.0",
      "brand 0.6.0",
      "ui 0.9.0",
      "ui 0.8.0",
      "ui 0.1.0",
      "brand 0.5.0",
    ]);
  });

  it("carries each repo's link definitions and never shows Unreleased", () => {
    const feed = buildFeed([ok(src("ui"), [rel("0.9.0", "2026-10-03")])]);
    expect(feed.entries).toHaveLength(1);
    expect(feed.entries[0]?.references).toEqual(["[x]: https://x.y"]);
  });

  it("filters by kind, including which failures it reports", () => {
    const results: ChangelogResult[] = [
      ok(src("ui"), [rel("0.9.0", "2026-10-03")]),
      ok(src("packs", "app"), [rel("0.1.0", "2026-10-04")]),
      { source: src("pools", "app"), error: true },
      { source: src("osu"), error: true },
    ];
    expect(names(results, "app")).toEqual(["packs 0.1.0"]);
    expect(buildFeed(results, "app").failed.map((s) => s.slug)).toEqual(["pools"]);
    expect(buildFeed(results).failed.map((s) => s.slug)).toEqual(["pools", "osu"]);
  });

  it("keeps the newest 30 and says when there are more", () => {
    const many = Array.from({ length: FEED_LIMIT + 1 }, (_, i) =>
      rel(`0.${i}.0`, `2026-01-${String((i % 28) + 1).padStart(2, "0")}`),
    );
    const feed = buildFeed([ok(src("ui"), many)]);
    expect(feed.entries).toHaveLength(FEED_LIMIT);
    expect(feed.more).toBe(true);
    expect(buildFeed([ok(src("ui"), many.slice(0, FEED_LIMIT))]).more).toBe(false);
    expect(FEED_LIMIT).toBe(30);
    expect(FEED_OPEN).toBe(1);
  });

  it("is empty with no results", () => {
    expect(buildFeed([])).toEqual({ entries: [], more: false, failed: [] });
  });
});

describe("groupByDate", () => {
  it("groups consecutive entries by date, undated last, in feed order", () => {
    const { entries } = buildFeed([
      ok(src("ui"), [rel("0.3.0", "2026-10-03"), rel("0.2.0", "2026-10-01"), rel("0.1.0", null)]),
      ok(src("osu"), [rel("1.0.0", "2026-10-03")]),
    ]);
    expect(
      groupByDate(entries).map((day) => [
        day.date,
        day.entries.map((e) => `${e.source.slug} ${e.release.version}`),
      ]),
    ).toEqual([
      ["2026-10-03", ["osu 1.0.0", "ui 0.3.0"]],
      ["2026-10-01", ["ui 0.2.0"]],
      [null, ["ui 0.1.0"]],
    ]);
    expect(groupByDate([])).toEqual([]);
  });
});

describe("latestVersions", () => {
  it("maps each loaded repo to its first release, skipping failures and empty files", () => {
    const versions = latestVersions([
      ok(src("ui"), [rel("0.19.0", "2026-10-06"), rel("0.18.0", "2026-10-05")]),
      ok(src("osu"), []),
      { source: src("pool"), error: true },
    ]);
    expect([...versions]).toEqual([["ui", "0.19.0"]]);
  });
});
