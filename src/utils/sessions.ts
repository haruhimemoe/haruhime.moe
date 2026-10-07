/**
 * @file src/utils/sessions.ts
 * @desc How /account's session list reads: a browser and system from a User-Agent ("Firefox on
 *       Windows"), and a day for a timestamp. A rough guess on purpose: it only has to tell a
 *       visitor's own devices apart, never identify one.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

/** Browsers, most specific first: Edge and Opera also say Chrome, Chrome also says Safari. */
const BROWSERS: readonly [RegExp, string][] = [
  [/\bEdg(?:e|A|iOS)?\//, "Edge"],
  [/\bOPR\/|\bOpera\b/, "Opera"],
  [/\bFirefox\/|\bFxiOS\//, "Firefox"],
  [/\bChrome\/|\bCriOS\//, "Chrome"],
  [/\bSafari\//, "Safari"],
];

/** Systems, most specific first: Android also says Linux, iOS also says Mac OS X. */
const SYSTEMS: readonly [RegExp, string][] = [
  [/\bAndroid\b/, "Android"],
  [/\biPhone\b|\biPad\b|\biPod\b/, "iOS"],
  [/\bWindows\b/, "Windows"],
  [/\bCrOS\b/, "ChromeOS"],
  [/\bMac OS X\b|\bMacintosh\b/, "macOS"],
  [/\bLinux\b/, "Linux"],
];

const firstMatch = (ua: string, table: readonly [RegExp, string][]): string | null =>
  table.find(([pattern]) => pattern.test(ua))?.[1] ?? null;

/**
 * @function describeDevice
 * @param userAgent {string | null | undefined} a session's User-Agent
 * @returns {string} "Firefox on Windows", "Safari", "Linux", or "Unknown device"
 */
export const describeDevice = (userAgent: string | null | undefined): string => {
  if (!userAgent) return "Unknown device";
  const browser = firstMatch(userAgent, BROWSERS);
  const system = firstMatch(userAgent, SYSTEMS);
  if (browser && system) return `${browser} on ${system}`;
  return browser ?? system ?? "Unknown device";
};

/**
 * @function formatSessionDay
 * @param value {Date | string} a timestamp
 * @returns {string} its day in UTC, e.g. "Oct 6, 2026" (the same on the server and in every
 *          browser), or "unknown" for an invalid date
 */
export const formatSessionDay = (value: Date | string): string => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "unknown";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
};
