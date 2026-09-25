/**
 * @file src/components/home/ToolCard.tsx
 * @desc One tool on the homepage: icon, name and tagline. A live tool's name links to it, with a
 *       small "beta" label while it's in beta; one that hasn't launched says "coming soon" and
 *       links nowhere.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Fri Sep 25, 2026
 */

import type { Tool } from "@/constants/tools";
import { cn } from "@/utils/cn";

/**
 * @function ToolCard
 * @param props {{ tool: Tool }} the tool to show
 * @returns {JSX.Element} a list item card; live tools link to their site
 */
export function ToolCard({ tool }: { tool: Tool }) {
  const label = tool.url ? (tool.beta ? "beta" : null) : "coming soon";
  return (
    <li
      className={cn(
        "relative flex items-start gap-4 rounded-[10px] bg-b4 p-5 text-c2",
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
        {label ? (
          <p className="mt-2 font-bold text-c4 text-xs uppercase tracking-wide">{label}</p>
        ) : null}
      </div>
    </li>
  );
}
