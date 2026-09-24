/**
 * @file src/utils/length.ts
 * @desc Beatmap lengths as m:ss, both ways, for the length RangeSlider on /ui.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
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
 * @param text {string} what someone typed: "m:ss" ("2:05"), or whole minutes ("3")
 * @returns {number | null} the length in seconds, or null when the text isn't a length
 */
export const parseLength = (text: string): number | null => {
  const clock = /^(\d+):([0-5]\d)$/.exec(text.trim());
  if (clock) return Number(clock[1]) * 60 + Number(clock[2]);
  const minutes = /^(\d+)$/.exec(text.trim());
  return minutes ? Number(minutes[1]) * 60 : null;
};
