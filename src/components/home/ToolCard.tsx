/**
 * @file src/components/home/ToolCard.tsx
 * @desc One tool on the homepage: icon, name and tagline up top, then room for one concrete
 *       sentence and a link to the tool's main task. A live tool's name links to it, with a small
 *       "beta" label beside the name while it's in beta; one that hasn't launched says "coming
 *       soon", links nowhere and sits dimmed. Two cards to a row: four squeezed every line.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Fri Oct 2, 2026
 */

import { Badge, Card, cx, TextLink } from "@haruhimemoe/ui";
import type { Tool } from "@/constants/tools";

/**
 * @function ToolCard
 * @param props {{ tool: Tool }} the tool to show
 * @returns {JSX.Element} a list item holding the tool's card; a live tool's name links its site,
 *   and the link covers the whole card, with its task link stacked above that cover
 */
export function ToolCard({ tool }: { tool: Tool }) {
  const label = tool.url ? (tool.beta ? "beta" : null) : "coming soon";
  return (
    <li className="flex">
      <Card
        className={cx(
          "relative flex w-full flex-col gap-4 sm:p-6",
          tool.url ? "transition-colors focus-within:bg-b3 hover:bg-b3" : "opacity-70",
        )}
      >
        <div className="flex items-center gap-4">
          {/* biome-ignore lint/performance/noImgElement: static SVG, no optimization needed */}
          <img src={`/${tool.icon}`} alt="" width={64} height={64} className="size-14 shrink-0" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h3 className="font-extrabold text-2xl text-c1 leading-tight">
                {tool.url ? (
                  // The link covers the whole card (after:absolute) so the card is one click target.
                  <a href={tool.url} className="after:absolute after:inset-0 after:rounded-[10px]">
                    {tool.name}
                  </a>
                ) : (
                  tool.name
                )}
              </h3>
              {label ? <Badge tone="muted">{label}</Badge> : null}
            </div>
            <p className="text-c4 text-sm">{tool.tagline}</p>
          </div>
        </div>
        {tool.url && tool.summary ? <p className="text-c2">{tool.summary}</p> : null}
        {tool.url && tool.task ? (
          // relative z-10 lifts the task link above the name link's card-wide cover.
          <TextLink
            href={`${tool.url}${tool.task.path}`}
            className="relative z-10 mt-auto w-fit font-bold text-sm"
          >
            {tool.task.label}
            <span aria-hidden="true"> →</span>
          </TextLink>
        ) : null}
      </Card>
    </li>
  );
}
