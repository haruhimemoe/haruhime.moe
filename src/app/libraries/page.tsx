/**
 * @file src/app/libraries/page.tsx
 * @desc /libraries: the eight @haruhimemoe packages, one card each with its description, install
 *       line, live stats (npm version and downloads, GitHub stars and latest release) and links.
 *       Static, rebuilt once a day so the numbers stay fresh without a request to npm or GitHub
 *       per visit.
 * @author David @dvhsh (https://dvh.sh)
 * @created Fri Oct 2, 2026
 * @modified Fri Oct 2, 2026
 */

import { PageHeader, TextLink } from "@haruhimemoe/ui";
import type { Metadata } from "next";
import { LibraryCard } from "@/components/libraries/LibraryCard";
import { LIBRARIES } from "@/constants/libraries";
import { SITE } from "@/constants/site";
import { fetchLibraryStats } from "@/lib/libraries/stats";
import { pageMetadata } from "@/utils/page-metadata";

export const metadata: Metadata = pageMetadata("/libraries");

/** Once a day: the stats are cached that long, and the page with them. */
export const revalidate = 86400;

export default async function LibrariesPage() {
  const stats = await Promise.all(LIBRARIES.map((library) => fetchLibraryStats(library)));
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Libraries"
        lead={
          <>
            The packages the tools are built from, each its own repo under{" "}
            <TextLink href={SITE.githubOrg}>github.com/haruhimemoe</TextLink> and on npm as{" "}
            <TextLink href="https://www.npmjs.com/org/haruhimemoe">@haruhimemoe</TextLink>. MIT
            licensed, ESM only. Each one's README is here as its docs page.
          </>
        }
      />
      <ul className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        {LIBRARIES.map((library, i) => (
          <LibraryCard
            key={library.name}
            library={library}
            stats={stats[i] as (typeof stats)[number]}
          />
        ))}
      </ul>
    </div>
  );
}
