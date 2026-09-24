/**
 * @file src/app/page.tsx
 * @desc Homepage: the stacked wordmark, a short hello, the tools (packs live, pools and sheets
 *       coming soon), the Evergreen Cup card and GitHub links. Static. Also the site's
 *       Organization and Person structured data.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

import type { Metadata } from "next";
import { ToolCard } from "@/components/home/ToolCard";
import { Card } from "@/components/ui/Card";
import { JsonLd } from "@/components/ui/JsonLd";
import { linkStyles } from "@/components/ui/linkStyles";
import { PageHeader } from "@/components/ui/PageHeader";
import { WORDMARK_SIZE } from "@/constants/brand";
import { EVERGREEN_CUP, SITE } from "@/constants/site";
import { TOOLS } from "@/constants/tools";

export const metadata: Metadata = {
  title: { absolute: `${SITE.name}: osu! tournament tools` },
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-6">
        {/* biome-ignore lint/performance/noImgElement: static SVG, no optimization needed */}
        <img
          src="/brand/haruhime-wordmark.svg"
          alt={SITE.name}
          width={WORDMARK_SIZE.width}
          height={WORDMARK_SIZE.height}
          className="h-20 w-auto self-start sm:h-28"
        />
        <PageHeader
          title="hi, I'm haruhime."
          lead="I make tools for osu! tournaments. they're built for hosts and the staff who help them."
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
      <Card title={EVERGREEN_CUP.name}>
        <p className="text-sm">
          {EVERGREEN_CUP.line}{" "}
          <a href={EVERGREEN_CUP.url} className={linkStyles}>
            evergreencup.org
          </a>
        </p>
      </Card>
      <p className="text-c3 text-sm">
        the code is on GitHub:{" "}
        <a href={SITE.githubOrg} className={linkStyles}>
          github.com/haruhimemoe
        </a>
        , and this site's source is{" "}
        <a href={SITE.sourceRepo} className={linkStyles}>
          haruhimemoe/haruhime.moe
        </a>
        .
      </p>
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
              logo: `${SITE.url}/brand/haruhime-icon.svg`,
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
