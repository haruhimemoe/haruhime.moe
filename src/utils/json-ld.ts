/**
 * @file src/utils/json-ld.ts
 * @desc Serialize schema.org JSON-LD for a <script> tag. "<" is escaped so no string inside
 *       (a thanks entry, say) can close the tag.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

/**
 * @function jsonLdString
 * @param data {Record<string, unknown>} a schema.org object without @context
 * @returns {string} JSON with @context added and every "<" written as \u003c
 */
export const jsonLdString = (data: Record<string, unknown>): string =>
  JSON.stringify({ "@context": "https://schema.org", ...data }).replace(/</g, "\\u003c");
