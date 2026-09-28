/**
 * @file src/utils/length.ts
 * @desc Beatmap lengths as m:ss, both ways, for the length RangeSlider on /ui. parseLength reads
 *       what packs and pools read (clock times, and minutes with a dot or comma decimal) so the
 *       demo behaves like the apps; @haruhimemoe/ui doesn't export a length parser yet.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Mon Sep 28, 2026
 */

/**
 * @function formatLength
 * @param seconds {number} a length in seconds
 * @returns {string} "m:ss", rounded to the second (125 is "2:05")
 */
export const formatLength = (seconds: number): string => {
  const total = Math.max(0, Math.round(seconds));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
};

/**
 * @function parseLength
 * @param text {string} what someone typed: "m:ss" ("2:05" or "1:5"), or minutes, whole or with a
 *        dot or comma decimal ("3", "2.5", "2,5")
 * @returns {number | null} the length in seconds ("2,5" is 150), or null when the text isn't one
 */
export const parseLength = (text: string): number | null => {
  const trimmed = text.trim().replace(",", ".");
  const clock = /^(\d+):(\d+)$/.exec(trimmed);
  if (clock) return Number(clock[1]) * 60 + Number(clock[2]);
  if (/^\d+(\.\d+)?$/.test(trimmed)) return Math.round(Number(trimmed) * 60);
  return null;
};
