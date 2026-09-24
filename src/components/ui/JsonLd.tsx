/**
 * @file src/components/ui/JsonLd.tsx
 * @desc schema.org structured data as a JSON-LD script tag.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

import { jsonLdString } from "@/utils/json-ld";

/**
 * @function JsonLd
 * @param props {{ data: Record<string, unknown> }} a schema.org object without @context
 * @returns {JSX.Element} a <script type="application/ld+json"> tag with the escaped data
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be raw JSON; jsonLdString escapes "<".
      dangerouslySetInnerHTML={{ __html: jsonLdString(data) }}
    />
  );
}
