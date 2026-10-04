/**
 * @file src/components/showcase/ToneDemos.tsx
 * @desc The tone demos at the top of /ui's Text group: Text in all six tones and a bold xs line,
 *       and textClasses on an element Text can't be. Server-rendered.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Sun Oct 4, 2026
 */

import { Text, textClasses } from "@haruhimemoe/ui";
import { Demo } from "@/components/showcase/Demo";

const TONES = ["default", "muted", "subtle", "error", "warning", "success"] as const;

/**
 * @function ToneDemos
 * @returns {JSX.Element} the Text and textClasses demos
 */
export function ToneDemos() {
  return (
    <>
      <Demo
        name="Text"
        note="A line in one of six tones and three sizes. Error, warning and success get one step lighter when your system asks for more contrast."
      >
        {TONES.map((tone) => (
          <Text key={tone} tone={tone}>
            {tone}: the pool was saved an hour ago.
          </Text>
        ))}
        <Text tone="error" size="xs" bold>
          xs, bold: That pack key is not valid.
        </Text>
      </Demo>
      <Demo
        name="textClasses"
        note="The same look as a string, for an element Text can't be: here, an output."
      >
        <output className={textClasses({ tone: "success" })}>Saved.</output>
      </Demo>
    </>
  );
}
