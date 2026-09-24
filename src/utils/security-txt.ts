/**
 * @file src/utils/security-txt.ts
 * @desc Builds the RFC 9116 body for /.well-known/security.txt: contact, an expiry a year out,
 *       and the policy link. Pure so the route handler and its tests share one source.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

import { SITE } from "@/constants/site";

const YEAR_MS = 365 * 24 * 60 * 60 * 1000;

/**
 * @function buildSecurityTxt
 * @param now {Date} the time the file is served, used to set Expires 365 days out
 * @returns {string} the RFC 9116 security.txt body, ending with a trailing newline
 */
export const buildSecurityTxt = (now: Date): string => {
  const expires = new Date(now.getTime() + YEAR_MS);
  const lines = [
    `Contact: mailto:${SITE.contactEmail}`,
    `Expires: ${expires.toISOString()}`,
    "Preferred-Languages: en",
    `Canonical: ${SITE.url}/.well-known/security.txt`,
    `Policy: ${SITE.githubOrg}/haruhime.moe/blob/main/SECURITY.md`,
  ];
  return `${lines.join("\n")}\n`;
};
