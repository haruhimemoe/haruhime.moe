/**
 * @file src/components/changelog/ChangelogLayout.tsx
 * @desc The frame every changelog page shares: ui's ContentLayout with a ContentNav beside the
 *       page ("All releases" first, then Apps, Packages and Claude plugin, each repo with its
 *       latest version), which folds into a "Contents" disclosure above the page on phones.
 *       ContentNav marks the current page itself.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Sun Oct 11, 2026
 */

import { ContentLayout, ContentNav } from "@haruhimemoe/ui";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { changelogNavGroups } from "@/utils/changelog-nav";

/**
 * @function ChangelogLayout
 * @param props {{ versions: ReadonlyMap<string, string>; children: ReactNode }} each repo's
 *   latest version (latestVersions) and the page
 * @returns {JSX.Element} the nav and the page side by side, stacked on phones
 */
export function ChangelogLayout({
  versions,
  children,
}: {
  versions: ReadonlyMap<string, string>;
  children: ReactNode;
}) {
  const t = useTranslations("hub.changelogLayout");
  const tc = useTranslations("hub.changelog");
  return (
    <ContentLayout
      nav={
        <ContentNav
          label={t("changelogs")}
          indexHref="/changelog"
          indexLabel={tc("allReleases")}
          groups={changelogNavGroups(versions)}
        />
      }
    >
      {children}
    </ContentLayout>
  );
}
