/**
 * @file src/components/home/ToolCard.tsx
 * @desc One tool on the homepage: icon, name and tagline up top, then room for one concrete
 *       sentence and a link to the tool's main task. A live tool's name links to it, with a small
 *       "beta" label beside the name while it's in beta; one that hasn't launched says "coming
 *       soon", links nowhere and its icon sits dimmed (the text keeps its full contrast). A live
 *       tool renders on LinkCard, so the whole card is one click target and the task link is
 *       lifted above the cover by LinkCard, not its own z-10; an unreleased tool renders on a
 *       plain Surface, with no hover. Two cards to a row: four squeezed every line.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Mon Oct 5, 2026
 */

import { Badge, CardLink, LinkCard, Surface, TextLink } from "@haruhimemoe/ui";
import type { Tool } from "@/constants/tools";

/**
 * @function ToolCard
 * @param props {{ tool: Tool }} the tool to show
 * @returns {JSX.Element} the tool's card; a live tool's name links its site and the card is one
 *   click target, with its task link lifted above the cover
 */
export function ToolCard({ tool }: { tool: Tool }) {
  const label = tool.url ? (tool.beta ? "beta" : null) : "coming soon";
  const body = (
    <>
      <div className="flex items-center gap-4">
        {/* biome-ignore lint/performance/noImgElement: static SVG, no optimization needed */}
        <img
          src={`/${tool.icon}`}
          alt=""
          width={64}
          height={64}
          // Only the art dims for an unreleased tool: dimming the whole card drops the text
          // below 4.5:1.
          className={tool.url ? "size-14 shrink-0" : "size-14 shrink-0 opacity-60"}
        />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="font-extrabold text-2xl text-c1 leading-tight">
              {tool.url ? (
                <CardLink href={tool.url} className="font-extrabold">
                  {tool.name}
                </CardLink>
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
        <TextLink
          href={`${tool.url}${tool.task.path}`}
          className="mt-auto w-fit coarse:py-2 font-bold text-sm"
        >
          {tool.task.label}
          <span aria-hidden="true"> →</span>
        </TextLink>
      ) : null}
    </>
  );
  return tool.url ? (
    <LinkCard className="sm:p-6">{body}</LinkCard>
  ) : (
    <Surface padding="lg" className="flex flex-col gap-4 sm:p-6">
      {body}
    </Surface>
  );
}
