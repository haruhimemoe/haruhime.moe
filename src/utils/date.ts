/**
 * @file src/utils/date.ts
 * @desc Date formatting for page copy.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

/**
 * @function formatIsoDate
 * @param iso {string} a calendar date, YYYY-MM-DD
 * @returns {string} the date in words, e.g. "September 23, 2026", the same in every timezone
 * @throws {RangeError} when iso isn't a real YYYY-MM-DD date
 */
export const formatIsoDate = (iso: string): string => {
  const date = new Date(`${iso}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso) || Number.isNaN(date.getTime())) {
    throw new RangeError(`not a YYYY-MM-DD date: ${iso}`);
  }
  if (date.toISOString().slice(0, 10) !== iso) {
    throw new RangeError(`not a YYYY-MM-DD date: ${iso}`);
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
};
