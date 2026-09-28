/**
 * @file src/components/showcase/ButtonDemos.tsx
 * @desc The button demos at the top of /ui's Basics group: Button in every variant and size,
 *       ButtonLink inside and off the site, and buttonClasses on a summary. Server-rendered.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Sep 28, 2026
 * @modified Mon Sep 28, 2026
 */

import { Button, ButtonLink, buttonClasses } from "@haruhimemoe/ui";
import { Demo } from "@/components/showcase/Demo";
import { UI_REPO_URL } from "@/constants/showcase";

const VARIANTS = ["primary", "secondary", "ghost"] as const;

/** One row of the three variants, in a size, enabled or not. */
const ButtonRow = ({ size, disabled }: { size?: "lg"; disabled?: boolean }) => (
  <div className="flex flex-wrap items-center gap-2">
    {VARIANTS.map((variant) => (
      <Button key={variant} variant={variant} size={size} disabled={disabled}>
        {variant[0]?.toUpperCase()}
        {variant.slice(1)}
      </Button>
    ))}
  </div>
);

/**
 * @function ButtonDemos
 * @returns {JSX.Element} the Button, ButtonLink and buttonClasses demos
 */
export function ButtonDemos() {
  return (
    <>
      <Demo name="Button" note="Primary, secondary and ghost, at md and lg, then disabled.">
        <ButtonRow />
        <ButtonRow size="lg" />
        <ButtonRow disabled />
      </Demo>

      <Demo
        name="ButtonLink"
        note="A link that looks like a button. Paths use next/link; a URL with a scheme is a plain link."
      >
        <div className="flex flex-wrap items-center gap-2">
          <ButtonLink href="/brand">Brand page</ButtonLink>
          <ButtonLink href={UI_REPO_URL} variant="secondary" target="_blank">
            Source on GitHub (new tab)
          </ButtonLink>
          <ButtonLink href="/" variant="ghost" size="lg">
            Home
          </ButtonLink>
        </div>
      </Demo>

      <Demo
        name="buttonClasses"
        note="The button classes as a string, for elements the components don't cover. Here, a summary."
      >
        <details>
          <summary className={buttonClasses({ variant: "secondary", className: "w-fit" })}>
            More
          </summary>
          <p className="mt-3 text-sm">It opens like any details element.</p>
        </details>
      </Demo>
    </>
  );
}
