/**
 * @file src/components/showcase/PaletteDemos.tsx
 * @desc /ui's Palette group: the command palette demos (CommandPaletteDemos, a client
 *       component), then the calculator and search-ranking helpers siteCommands doesn't cover on
 *       its own: evaluate, formatResult and fuzzyScore, each run on the server and shown in a
 *       highlighted CodeBlock (an async Server Component, so these three can't sit in the client
 *       file).
 * @author David @dvhsh (https://dvh.sh)
 * @created Sat Oct 3, 2026
 * @modified Sun Oct 4, 2026
 */

import { evaluate, formatResult, fuzzyScore } from "@haruhimemoe/ui";
import { CodeBlock } from "@haruhimemoe/ui/mdx";
import { CommandPaletteDemos } from "@/components/showcase/CommandPaletteDemos";
import { Demo } from "@/components/showcase/Demo";

/**
 * @function PaletteDemos
 * @returns {JSX.Element} the Palette group's demos
 */
export function PaletteDemos() {
  return (
    <>
      <CommandPaletteDemos />

      <Demo
        name="evaluate"
        note="The palette's calculator, without eval: +-*/%^, unary minus, parentheses, k/m suffixes, pi, e, sqrt, abs, round, floor, ceil, min and max. Unparseable or non-finite is null."
      >
        <CodeBlock
          code={`evaluate("1.5k * (2 + sqrt(9))")\n// ${evaluate("1.5k * (2 + sqrt(9))")}`}
          lang="ts"
          title="Example"
        />
      </Demo>

      <Demo
        name="formatResult"
        note="A calculator result as the palette shows it: up to 10 significant digits, trailing zeros dropped."
      >
        <CodeBlock
          code={`formatResult(1 / 3)\n// "${formatResult(1 / 3)}"`}
          lang="ts"
          title="Example"
        />
      </Demo>

      <Demo
        name="fuzzyScore"
        note="The palette's own ranking: a query matches when its letters appear in order, scored higher at a word start. A Provider can reuse it to rank its own rows the same way."
      >
        <CodeBlock
          code={`fuzzyScore("cpu", "Copy page URL")\n// ${JSON.stringify(fuzzyScore("cpu", "Copy page URL"))}\nfuzzyScore("go", "Sign out")\n// ${JSON.stringify(fuzzyScore("go", "Sign out"))}`}
          lang="ts"
          title="Example"
        />
      </Demo>
    </>
  );
}
