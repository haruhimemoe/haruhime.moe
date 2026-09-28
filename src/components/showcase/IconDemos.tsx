/**
 * @file src/components/showcase/IconDemos.tsx
 * @desc /ui's Icons group: DiscordIcon, GitHubIcon, HaruhimeWordmark and HaruhimeWordmarkLink, at
 *       their default size and larger, and inside named links. Server-rendered.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Sep 28, 2026
 * @modified Mon Sep 28, 2026
 */

import { DiscordIcon, GitHubIcon, HaruhimeWordmark, HaruhimeWordmarkLink } from "@haruhimemoe/ui";
import { Demo } from "@/components/showcase/Demo";
import { UI_REPO_URL } from "@/constants/showcase";
import { SITE } from "@/constants/site";

/**
 * @function IconDemos
 * @returns {JSX.Element} the Icons group's demos
 */
export function IconDemos() {
  return (
    <>
      <Demo
        name="DiscordIcon"
        note="The Discord logo in the text color, kept white here (one of the colors Discord's brand guidelines allow), at the default size and larger. Screen readers skip it, so the link around it carries the name."
      >
        <div className="flex flex-wrap items-center gap-4 text-c1">
          <DiscordIcon />
          <DiscordIcon className="size-8" />
          <a
            href={SITE.discordUrl}
            aria-label="haruhime.moe on Discord"
            className="transition-opacity hover:opacity-80"
          >
            <DiscordIcon className="size-8" />
          </a>
        </div>
      </Demo>

      <Demo
        name="GitHubIcon"
        note="The GitHub mark in the text color, at the default size and larger. Screen readers skip it, so the link around it carries the name."
      >
        <div className="flex flex-wrap items-center gap-4 text-c2">
          <GitHubIcon />
          <GitHubIcon className="size-8" />
          <a
            href={UI_REPO_URL}
            aria-label="@haruhimemoe/ui on GitHub"
            className="text-c3 transition-colors hover:text-c1"
          >
            <GitHubIcon className="size-8" />
          </a>
        </div>
      </Demo>

      <Demo
        name="HaruhimeWordmark"
        note="The wordmark as inline SVG, in the brand's own colors, at the default size and larger. This site's header draws it too."
      >
        <div className="flex flex-wrap items-end gap-6">
          <HaruhimeWordmark />
          <HaruhimeWordmark className="h-12 w-auto" />
        </div>
      </Demo>

      <Demo
        name="HaruhimeWordmarkLink"
        note="The wordmark linking to haruhime.moe, dimmed until hovered. The tool sites put it in their footer."
      >
        <HaruhimeWordmarkLink />
      </Demo>
    </>
  );
}
