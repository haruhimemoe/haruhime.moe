/**
 * @file src/app/ui/page.tsx
 * @desc /ui: every component @haruhimemoe/ui exports, rendered from the installed package in its
 *       states. GROUPS lists the groups in page order; each group's demos live in
 *       src/components/showcase/. The page's own header, frame and footer are the PageHeader and
 *       shell examples. Static; the demos that take callbacks are small client components.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Sat Oct 3, 2026
 */

import { CopyButton, JsonLd, PageHeader, TextLink } from "@haruhimemoe/ui";
import uiPackage from "@haruhimemoe/ui/package.json" with { type: "json" };
import type { Metadata } from "next";
import type { JSX } from "react";
import { ActionDemos } from "@/components/showcase/ActionDemos";
import { BasicsDemos } from "@/components/showcase/BasicsDemos";
import { DemoGroup } from "@/components/showcase/DemoGroup";
import { FilterDemos } from "@/components/showcase/FilterDemos";
import { FormDemos } from "@/components/showcase/FormDemos";
import { IconDemos } from "@/components/showcase/IconDemos";
import { OsuDemos } from "@/components/showcase/OsuDemos";
import { PaletteDemos } from "@/components/showcase/PaletteDemos";
import { ShellDemos } from "@/components/showcase/ShellDemos";
import { TableDemos } from "@/components/showcase/TableDemos";
import { TextDemos } from "@/components/showcase/TextDemos";
import { UtilityDemos } from "@/components/showcase/UtilityDemos";
import { UI_INSTALL, UI_NPM_URL, UI_REPO_URL } from "@/constants/showcase";
import { SITE } from "@/constants/site";
import { pageMetadata } from "@/utils/page-metadata";

export const metadata: Metadata = pageMetadata("/ui");

/** The groups, in page order: anchor id, heading, and the demos under it. */
const GROUPS: readonly { id: string; title: string; Demos: () => JSX.Element }[] = [
  { id: "basics", title: "Basics", Demos: BasicsDemos },
  { id: "text", title: "Text", Demos: TextDemos },
  { id: "forms", title: "Forms", Demos: FormDemos },
  { id: "actions", title: "Actions", Demos: ActionDemos },
  { id: "filters", title: "Filters", Demos: FilterDemos },
  { id: "tables", title: "Tables", Demos: TableDemos },
  { id: "osu", title: "osu!", Demos: OsuDemos },
  { id: "icons", title: "Icons", Demos: IconDemos },
  { id: "shell", title: "Shell", Demos: ShellDemos },
  { id: "palette", title: "Palette", Demos: PaletteDemos },
  { id: "utilities", title: "Utilities", Demos: UtilityDemos },
];

export default function UiPage() {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="UI"
          lead={
            <>
              Every component in <TextLink href={UI_NPM_URL}>@haruhimemoe/ui</TextLink>, rendered
              from the package itself. haruhime.moe, packs, pools and bb are built from it. The
              source is on <TextLink href={UI_REPO_URL}>GitHub</TextLink>, and its README is at{" "}
              <TextLink href="/libraries/ui">/libraries/ui</TextLink>.
            </>
          }
          meta={`Version ${uiPackage.version}, ${uiPackage.license} license. Install: ${UI_INSTALL}`}
          actions={<CopyButton text={UI_INSTALL} label="Copy install command" />}
        />
        <nav aria-label="On this page">
          <ul className="flex flex-wrap gap-x-5 gap-y-1 font-bold text-sm">
            {GROUPS.map((group) => (
              <li key={group.id}>
                <a href={`#${group.id}`} className="text-c3 transition-colors hover:text-c1">
                  {group.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {GROUPS.map(({ id, title, Demos }) => (
        <DemoGroup key={id} id={id} title={title}>
          <Demos />
        </DemoGroup>
      ))}

      <JsonLd
        data={{
          "@type": "SoftwareSourceCode",
          name: uiPackage.name,
          description: uiPackage.description,
          codeRepository: UI_REPO_URL,
          url: UI_NPM_URL,
          version: uiPackage.version,
          programmingLanguage: "TypeScript",
          license: `https://spdx.org/licenses/${uiPackage.license}.html`,
          author: { "@id": `${SITE.url}/#person` },
        }}
      />
    </div>
  );
}
