/**
 * @file src/components/home/ToolCard.tsx
 * @desc One tool on the homepage: icon, name and tagline. A live tool's name links to it, with a
 *       small "beta" label while it's in beta, one concrete sentence, and a link to its main task;
 *       one that hasn't launched says "coming soon" and links nowhere.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Mon Sep 28, 2026
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
          "relative flex w-full items-start gap-4",
          tool.url && "transition-colors focus-within:bg-b3 hover:bg-b3",
        )}
      >
        {/* biome-ignore lint/performance/noImgElement: static SVG, no optimization needed */}
        <img src={`/${tool.icon}`} alt="" width={64} height={64} className="size-12 shrink-0" />
        <div className="min-w-0">
          <h3 className="font-bold text-c1 text-lg">
            {tool.url ? (
              // The link covers the whole card (after:absolute) so the card is one click target.
              <a href={tool.url} className="after:absolute after:inset-0 after:rounded-[10px]">
                {tool.name}
              </a>
            ) : (
              tool.name
            )}
          </h3>
          <p className="text-sm">{tool.tagline}</p>
          {tool.url && tool.summary ? <p className="mt-2 text-c3 text-sm">{tool.summary}</p> : null}
          {tool.url && tool.task ? (
            // relative z-10 lifts the task link above the name link's card-wide cover.
            <TextLink
              href={`${tool.url}${tool.task.path}`}
              className="relative z-10 mt-2 inline-block text-sm"
            >
              {tool.task.label}
            </TextLink>
          ) : null}
          {label ? (
            <Badge tone="muted" className="mt-2">
              {label}
            </Badge>
          ) : null}
        </div>
      </Card>
    </li>
  );
}
