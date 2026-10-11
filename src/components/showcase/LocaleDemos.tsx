/**
 * @file src/components/showcase/LocaleDemos.tsx
 * @desc /ui's translation demos: LocaleSelect with two locales (picking one sets the shared
 *       NEXT_LOCALE cookie and refreshes), localeName, writeLocaleCookie, and the English label
 *       objects apps replace with their own words. A client component: LocaleSelect needs the
 *       router.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 11, 2026
 * @modified Sun Oct 11, 2026
 */

"use client";

import {
  BRAND_PAGE_LABELS,
  CONTENT_PAGE_LABELS,
  LocaleSelect,
  localeName,
  PALETTE_LABELS,
  SITE_COMMAND_LABELS,
  writeLocaleCookie,
} from "@haruhimemoe/ui";
import { Demo } from "@/components/showcase/Demo";

/**
 * @function LocaleDemos
 * @returns {JSX.Element} the LocaleSelect demo and the label constants
 */
export function LocaleDemos() {
  return (
    <>
      <Demo
        name="LocaleSelect"
        note="A language picker for apps without locales in their URLs. One locale renders nothing."
      >
        <LocaleSelect locales={["en", "ja"]} value="en" hideLabel={false} />
      </Demo>
      <Demo
        name="localeName"
        note={`A language named in itself: ${["en", "ja", "ko", "pt-BR"].map(localeName).join(", ")}.`}
      />
      <Demo
        name="writeLocaleCookie"
        note={`Writes NEXT_LOCALE on a shared domain, what LocaleSelect does on a pick. Typeof: ${typeof writeLocaleCookie}.`}
      />
      <Demo
        name="PALETTE_LABELS"
        note={`The command palette's English words, like "${PALETTE_LABELS.results(3)}".`}
      />
      <Demo
        name="SITE_COMMAND_LABELS"
        note={`siteCommands' English titles, like "${SITE_COMMAND_LABELS.goTo("Pools")}".`}
      />
      <Demo
        name="CONTENT_PAGE_LABELS"
        note={`ContentPage's English meta words, like "${CONTENT_PAGE_LABELS.readingTime(4)}".`}
      />
      <Demo
        name="BRAND_PAGE_LABELS"
        note={`BrandPage's English headings: ${BRAND_PAGE_LABELS.name}, ${BRAND_PAGE_LABELS.logo}, ${BRAND_PAGE_LABELS.colors}.`}
      />
    </>
  );
}
