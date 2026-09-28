/**
 * @file src/utils/security-txt.ts
 * @desc Builds the RFC 9116 body for /.well-known/security.txt: contact, the pinned expiry, and
 *       the policy link. Pure so the route handler and its tests share one source.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Mon Sep 28, 2026
 */

import { SECURITY_TXT_EXPIRES } from "@/constants/legal";
import { SITE } from "@/constants/site";

/**
 * @function buildSecurityTxt
 * @param expires {string} the Expires value in ISO 8601 UTC; defaults to SECURITY_TXT_EXPIRES.
 *        The route is static, so this is fixed at build time, not when the file is served.
 * @returns {string} the RFC 9116 security.txt body, ending with a trailing newline
 */
export const buildSecurityTxt = (expires: string = SECURITY_TXT_EXPIRES): string => {
  const lines = [
    `Contact: mailto:${SITE.contactEmail}`,
    `Expires: ${expires}`,
    "Preferred-Languages: en",
    `Canonical: ${SITE.url}/.well-known/security.txt`,
    `Policy: ${SITE.githubOrg}/haruhime.moe/blob/main/SECURITY.md`,
  ];
  return `${lines.join("\n")}\n`;
};
