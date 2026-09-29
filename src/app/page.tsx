/**
 * @file src/app/page.tsx
 * @desc Homepage: the Evergreen Cup banner up top, the h1 and a short hello saying what the site
 *       is, and the tools (packs live, pools live in beta, bb live, sheets coming soon), each with
 *       a link to its main task. Static. Also the site's JSON-LD: the haruhime.moe Organization
 *       (next-kit's HARUHIME_ORG, @id https://www.haruhime.moe/#organization), haruhime as its
 *       founder, and the WebSite with each live tool's site as a part.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Mon Sep 28, 2026
 */

import { HARUHIME_ORG, homeMetadata, ld } from "@haruhimemoe/next-kit/seo";
import { JsonLd, PageHeader } from "@haruhimemoe/ui";
import type { Metadata } from "next";
import { EgcBanner } from "@/components/home/EgcBanner";
import { ToolCard } from "@/components/home/ToolCard";
import { SEO_SITE } from "@/constants/seo";
import { SITE } from "@/constants/site";
import { TOOLS } from "@/constants/tools";

export const metadata: Metadata = homeMetadata(SEO_SITE);

const PERSON_ID = `${SITE.url}/#person`;

/** Organization, Person and WebSite, tied together by @id. */
const HOME_LD = ld.graph(
  { ...ld.organization(HARUHIME_ORG), founder: { "@id": PERSON_ID } },
  { "@type": "Person", "@id": PERSON_ID, name: SITE.person, url: SITE.url },
  {
    ...ld.webSite(SEO_SITE),
    hasPart: TOOLS.flatMap((tool) => (tool.url ? [{ "@id": `${tool.url}/#website` }] : [])),
  },
);

export default function HomePage() {
  return (
    <div className="flex flex-col gap-10">
      <EgcBanner />
      <PageHeader
        title="osu! tools for players, mappers and tournament hosts"
        lead="hellosu, haruhime here. these are free tools i make for osu!: packs turns a mappool into one download, pools is for building and looking up tournament pools, and bb is a BBCode editor for userpages and forum posts. none of it is made by or tied to ppy."
      />
      <section aria-labelledby="tools-heading" className="flex flex-col gap-4">
        <h2 id="tools-heading" className="font-bold text-c1 text-xl">
          Tools
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TOOLS.map((tool) => (
            <ToolCard key={tool.name} tool={tool} />
          ))}
        </ul>
      </section>
      <JsonLd data={HOME_LD} />
    </div>
  );
}
