/**
 * @file src/app/page.tsx
 * @desc Homepage: the Evergreen Cup banner up top, a short hello, and the tools (packs live,
 *       pools and sheets coming soon). Static. Also the site's Organization and Person
 *       structured data.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

import type { Metadata } from "next";
import { EgcBanner } from "@/components/home/EgcBanner";
import { ToolCard } from "@/components/home/ToolCard";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { SITE } from "@/constants/site";
import { TOOLS } from "@/constants/tools";

export const metadata: Metadata = {
  title: { absolute: `${SITE.name}: osu! tournament tools` },
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

export default function HomePage() {
  return (
    <div className="flex flex-col gap-10">
      <EgcBanner />
      <div className="flex flex-col gap-6">
        <PageHeader
          title="hellosu haruhime here"
          lead="this is a small collection of tools intended to help with the production of osu! tournaments"
        />
      </div>
      <section aria-labelledby="tools-heading" className="flex flex-col gap-4">
        <h2 id="tools-heading" className="font-bold text-c1 text-xl">
          Tools
        </h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          {TOOLS.map((tool) => (
            <ToolCard key={tool.name} tool={tool} />
          ))}
        </ul>
      </section>
      <JsonLd
        data={{
          "@graph": [
            {
              "@type": "Person",
              "@id": `${SITE.url}/#person`,
              name: SITE.person,
              url: SITE.url,
            },
            {
              "@type": "Organization",
              "@id": `${SITE.url}/#organization`,
              name: SITE.name,
              url: SITE.url,
              logo: `${SITE.url}/apple-icon.png`,
              email: SITE.contactEmail,
              sameAs: [SITE.githubOrg],
              founder: { "@id": `${SITE.url}/#person` },
            },
          ],
        }}
      />
    </div>
  );
}
