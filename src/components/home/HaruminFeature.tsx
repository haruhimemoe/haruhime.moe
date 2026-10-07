/**
 * @file src/components/home/HaruminFeature.tsx
 * @desc harumin's spot on the homepage, above the tool cards: a white, black-ink panel in
 *       harumin.haruhime.moe's manga look (speed lines behind the name, a screentone corner, a
 *       narration box), with what the bot does, a two-message sample, and links to the site and
 *       its commands. Its colors are its own, not the dark theme's, so it reads as harumin's page
 *       set into this one. The name is a paragraph, not a heading, like the Evergreen Cup banner.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Oct 7, 2026
 * @modified Wed Oct 7, 2026
 */

import { useId } from "react";
import { TOOLS } from "@/constants/tools";

const INK = "#1d1416";
const ROSE = "#b3123a";

const SPEEDLINES = {
  backgroundImage: `repeating-conic-gradient(from 0deg at 30% 50%, ${INK}22 0deg 0.6deg, transparent 0.6deg 7deg)`,
  maskImage:
    "radial-gradient(closest-side at 30% 50%, transparent 40%, black 70%, transparent 100%)",
} as const;

const SCREENTONE = {
  backgroundImage: `radial-gradient(circle at center, ${INK}38 0.9px, transparent 1.3px)`,
  backgroundSize: "6px 6px",
  maskImage: "radial-gradient(circle at bottom right, black, transparent 70%)",
} as const;

/** harumin's TOOLS entry: its URL, the one place this component reads it from. */
const HARUMIN_URL =
  TOOLS.find((tool) => tool.name === "harumin")?.url ?? "https://harumin.haruhime.moe";

/**
 * @function HaruminFeature
 * @returns {JSX.Element} the harumin panel
 */
export function HaruminFeature() {
  const nameId = useId();
  return (
    <section
      aria-labelledby={nameId}
      className="relative isolate grid gap-8 overflow-hidden rounded-[10px] bg-white p-6 sm:p-9 md:grid-cols-[1.1fr_1fr] md:items-center"
      style={{ color: INK, border: `1.5px solid ${INK}` }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={SPEEDLINES}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -bottom-6 -z-10 size-48"
        style={SCREENTONE}
      />
      <div className="flex flex-col gap-4">
        <p className="font-bold text-sm uppercase tracking-[0.2em]" style={{ color: ROSE }}>
          New: the osu! Discord bot
        </p>
        <p id={nameId} className="font-extrabold text-5xl leading-none tracking-tight sm:text-6xl">
          harumin
          <span aria-hidden="true" style={{ color: ROSE }}>
            .
          </span>
        </p>
        <p className="max-w-md text-lg" style={{ color: `${INK}cc` }}>
          Profiles, recent and top plays with pp, and map cards for your server. Link a map once and
          every command knows which one you mean.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href={HARUMIN_URL}
            className="rounded-full px-5 py-2.5 font-bold text-white transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ backgroundColor: INK, outlineColor: ROSE }}
          >
            Add harumin
          </a>
          <a
            href={`${HARUMIN_URL}/commands`}
            className="rounded-full px-5 py-2.5 font-bold transition-colors hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ border: `1.5px solid ${INK}`, outlineColor: ROSE }}
          >
            See the commands
          </a>
        </div>
      </div>
      <figure aria-label="Sample Discord messages with harumin" className="relative pt-4">
        <p
          className="absolute top-0 left-4 z-10 rounded-[3px] bg-white px-3 py-1 font-bold text-sm"
          style={{ border: `1.5px solid ${INK}` }}
        >
          #tourney-chat
        </p>
        <div
          className="flex flex-col gap-3 rounded-[3px] bg-white p-4 pt-7 text-sm"
          style={{ border: `1.5px solid ${INK}` }}
        >
          <p>
            <b>yuki</b> <code className="rounded-sm bg-black/5 px-1">/score</code>
          </p>
          <div className="rounded-sm bg-black/5 p-3" style={{ borderLeft: `4px solid ${INK}` }}>
            <p className="font-bold">haruhime - first combo [Expert]</p>
            <p>
              <b>S</b> · +HD · 6.31★ · <b>298.40pp</b> (FC 316.02pp) · 98.12%
            </p>
          </div>
        </div>
        <figcaption
          className="relative z-10 -mt-3 mr-4 ml-auto w-fit max-w-[16rem] rounded-[3px] bg-white px-3 py-1.5 text-sm"
          style={{ border: `1.5px solid ${INK}` }}
        >
          No map given. The channel remembered it.
        </figcaption>
      </figure>
    </section>
  );
}
