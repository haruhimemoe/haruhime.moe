/**
 * @file tests/unit/content/thanks.test.ts
 * @desc Thanks data shape: names, optional https links, one line each, and the player card
 *       snapshots (osu! ids, countries, osu!-hosted images, a role each).
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Sun Oct 4, 2026
 */

import { describe, expect, it } from "vitest";
import { THANKS } from "@/content/thanks";

describe("THANKS", () => {
  it("has entries", () => {
    expect(THANKS.length).toBeGreaterThan(0);
  });

  it("has unique, non-empty names", () => {
    const names = THANKS.map((entry) => entry.name);
    expect(names.every((name) => name.trim().length > 0)).toBe(true);
    expect(new Set(names).size).toBe(names.length);
  });

  it.each(THANKS.map((entry) => [entry.name, entry] as const))(
    "%s has one line and, if linked, an https URL",
    (_name, entry) => {
      expect(entry.line.trim().length).toBeGreaterThan(0);
      expect(entry.line).not.toContain("\n");
      if (entry.url !== undefined) {
        expect(new URL(entry.url).protocol).toBe("https:");
      }
      expect(
        Object.keys(entry).every((key) => ["name", "url", "line", "players"].includes(key)),
      ).toBe(true);
    },
  );

  const players = THANKS.flatMap((entry) => entry.players ?? []);

  it("has a card for every osu! player, 11 with an account and 3 name-only", () => {
    expect(players).toHaveLength(14);
    expect(players.filter((player) => player.osu)).toHaveLength(11);
  });

  it("has unique usernames and osu! ids", () => {
    const names = players.map((player) => player.username.toLowerCase());
    expect(new Set(names).size).toBe(names.length);
    const ids = players.flatMap((player) => (player.osu ? [player.osu.id] : []));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(players.map((player) => [player.username, player] as const))(
    "%s has a role, and a sane osu! snapshot if any",
    (_name, player) => {
      expect(player.username.trim()).toBe(player.username);
      expect(player.username.length).toBeGreaterThan(0);
      expect(player.role.trim().length).toBeGreaterThan(0);
      expect(player.formerly?.trim().length ?? 1).toBeGreaterThan(0);
      expect(
        Object.keys(player).every((key) => ["username", "osu", "role", "formerly"].includes(key)),
      ).toBe(true);
      const osu = player.osu;
      if (!osu) return;
      expect(Number.isInteger(osu.id) && osu.id > 0).toBe(true);
      expect(osu.country).toMatch(/^[A-Z]{2}$/);
      for (const url of [osu.cover, osu.team?.flag]) {
        if (url === undefined) continue;
        const { protocol, hostname } = new URL(url);
        expect(protocol).toBe("https:");
        expect(["assets.ppy.sh", "osu.ppy.sh"]).toContain(hostname);
      }
      if (osu.team) expect(osu.team.name.trim().length).toBeGreaterThan(0);
    },
  );
});
