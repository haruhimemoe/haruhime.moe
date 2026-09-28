/**
 * @file src/components/showcase/TableDemos.tsx
 * @desc /ui's Tables group: Table, THead, TBody, Th and Td over the sample pool's first slots, with
 *       row headers, numeric cells, a ModBadge and a StarRating in each row. Server-rendered.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Sep 28, 2026
 * @modified Mon Sep 28, 2026
 */

import { ModBadge, StarRating, Table, TBody, Td, THead, Th } from "@haruhimemoe/ui";
import { Demo } from "@/components/showcase/Demo";
import { SAMPLE_POOL } from "@/constants/showcase";
import { formatLength } from "@/utils/length";

const ROWS = SAMPLE_POOL.filter((map) => map.slot.endsWith("1"));

/** The parts inside Table, each a note on the table above it. */
const PARTS = [
  ["THead", "The header row group of the table above."],
  ["TBody", "Its body row group, with a line between rows."],
  ["Th", "A column header (scope col by default), or a bold row header with scope row: the slots."],
  ["Td", "A cell. Numeric ones (stars, length, BPM) use tabular numbers, so digits line up."],
] as const;

/**
 * @function TableDemos
 * @returns {JSX.Element} the Table demo, then a note for each part inside it
 */
export function TableDemos() {
  return (
    <>
      <Demo
        name="Table"
        note="The table in a wrapper that scrolls sideways on narrow screens, with a caption (shown here; it can be for screen readers only)."
      >
        <Table caption="The sample pool's first slot of each mod">
          <THead>
            <tr>
              <Th>Slot</Th>
              <Th>Mod</Th>
              <Th numeric>Stars</Th>
              <Th numeric>Length</Th>
              <Th numeric>BPM</Th>
            </tr>
          </THead>
          <TBody>
            {ROWS.map((map) => (
              <tr key={map.slot}>
                <Th scope="row">{map.slot}</Th>
                <Td>
                  <ModBadge mod={map.mod} />
                </Td>
                <Td numeric>
                  <StarRating value={map.stars} />
                </Td>
                <Td numeric>{formatLength(map.length)}</Td>
                <Td numeric>{map.bpm}</Td>
              </tr>
            ))}
          </TBody>
        </Table>
      </Demo>
      {PARTS.map(([name, note]) => (
        <Demo key={name} name={name} note={note} />
      ))}
    </>
  );
}
