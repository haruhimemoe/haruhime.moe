/**
 * @file src/components/showcase/SortableDemos.tsx
 * @desc /ui's Sortable group (ui 0.15.0): SortableList with Up and Down, a two-list board on
 *       useSortable that refuses one move and says why, notes on SortableHandle,
 *       SortableMoveButtons and SortableLayer, moveItem, and the two indicator class strings
 *       drawn in each state. Sample data. A client component: the lists take callbacks.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Mon Oct 5, 2026
 */

"use client";

import {
  moveItem,
  SORTABLE_CONTAINER,
  SORTABLE_ITEM,
  SortableHandle,
  SortableLayer,
  SortableList,
  SortableMoveButtons,
  Text,
  useSortable,
} from "@haruhimemoe/ui";
import { useState } from "react";
import { Demo } from "@/components/showcase/Demo";

const STAGES = ["Qualifiers", "Round of 16", "Quarterfinals", "Semifinals"];
const LISTS: readonly { key: string; name: string }[] = [
  { key: "nm", name: "NM" },
  { key: "hd", name: "HD" },
];

/** Applies a board move: `to.index` is already the index after the item leaves its list. */
const applyMove = (
  was: Record<string, string[]>,
  id: string,
  to: { container: string; index: number },
): Record<string, string[]> => {
  const without = Object.fromEntries(
    Object.entries(was).map(([key, ids]) => [key, ids.filter((item) => item !== id)]),
  );
  const target = [...(without[to.container] ?? [])];
  target.splice(to.index, 0, id);
  return { ...without, [to.container]: target };
};

/**
 * @function SortableDemos
 * @returns {JSX.Element} the eight sortable demos
 */
export function SortableDemos() {
  const [stages, setStages] = useState(STAGES);
  const [board, setBoard] = useState<Record<string, string[]>>({
    nm: ["NM1", "NM2", "NM3"],
    hd: ["HD1", "HD2"],
  });
  const sortable = useSortable({
    onMove: ({ id, to }) => setBoard((was) => applyMove(was, id, to)),
    canDrop: ({ id, to }) => (id === "NM1" && to.container === "hd" ? "NM1 stays in NM." : true),
  });
  const example = moveItem(["a", "b", "c"], 0, 2);
  return (
    <>
      <Demo
        name="SortableList"
        note="One list on its own hook. Drag a row by its grip with a mouse or a finger, or focus the grip and use Space and the arrow keys. Up and Down do the same in one press. Sample stages."
      >
        <SortableList
          items={stages}
          getId={(stage) => stage}
          getLabel={(stage) => stage}
          label="Stages"
          aria-label="Sample stages"
          onMove={({ from, to }) => setStages((was) => moveItem(was, from.index, to.index))}
          className="gap-2 [--sortable-gap:0.5rem]"
          itemClassName="flex items-center gap-3 rounded-[10px] bg-b4 p-3"
        >
          {(stage, { handle, moveButtons }) => (
            <>
              {handle}
              <span className="flex-1 font-bold text-c1">{stage}</span>
              {moveButtons}
            </>
          )}
        </SortableList>
      </Demo>

      <Demo
        name="useSortable"
        note="The hook behind it, for several lists at once. NM1 can't go to HD, and the board says why. Sample slots."
      >
        <SortableLayer sortable={sortable} />
        <div className="grid gap-4 sm:grid-cols-2">
          {LISTS.map(({ key, name }) => (
            <div key={key} className="flex flex-col gap-2">
              <h4 id={`sortable-demo-${key}`} className="font-bold text-c2">
                {name}
              </h4>
              <ol
                aria-labelledby={`sortable-demo-${key}`}
                {...sortable.container(key, { label: name })}
                className={`${SORTABLE_CONTAINER} flex min-h-16 flex-col gap-2 rounded-[10px] border border-b4 p-2 [--sortable-gap:0.5rem]`}
              >
                {(board[key] ?? []).map((id, index) => (
                  <li
                    key={id}
                    {...sortable.item(id, { container: key, index, label: id })}
                    className={`${SORTABLE_ITEM} flex items-center gap-3 rounded-md bg-b4 p-2`}
                  >
                    <SortableHandle sortable={sortable} id={id} />
                    <span className="flex-1 text-c1">{id}</span>
                    <SortableMoveButtons sortable={sortable} id={id} label={id} />
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </Demo>

      <Demo
        name="SortableHandle"
        note="The grip in every row above: a button named “Reorder …”, 24px, 44px on touch screens, pressed while it is picked up."
      />
      <Demo
        name="SortableMoveButtons"
        note="Up and Down beside each row: the same move, read out, with focus kept on the button you pressed (or the other one at an end)."
      />
      <Demo
        name="SortableLayer"
        note="One per hook, out of sight: the live region that reads each pick-up, step and drop, and the instructions each grip points at."
      />

      <Demo name="moveItem" note="Applies a move to an array: the one line an onMove needs.">
        <p className="font-mono text-c2 text-sm">
          moveItem(["a", "b", "c"], 0, 2) gives {JSON.stringify(example)}
        </p>
      </Demo>

      <Demo
        name="SORTABLE_ITEM"
        note="The item classes for the hook used directly, keyed off data attributes: a line where the item will land, a dashed outline on a drop target, a grey one on the lifted item and on a refused target."
      >
        <ul className="flex flex-col gap-3 [--sortable-gap:0.75rem]">
          <li
            className={`${SORTABLE_ITEM} rounded-md bg-b4 p-2 text-c1`}
            data-sortable-drop="before"
            data-sortable-line="top"
          >
            Lands above this one
          </li>
          <li className={`${SORTABLE_ITEM} rounded-md bg-b4 p-2 text-c1`} data-sortable-drop="onto">
            Drop target
          </li>
          <li
            className={`${SORTABLE_ITEM} rounded-md bg-b4 p-2 text-c1`}
            data-sortable-state="lifted"
          >
            Picked up
          </li>
          <li
            className={`${SORTABLE_ITEM} rounded-md bg-b4 p-2 text-c1`}
            data-sortable-drop="onto"
            data-sortable-refused=""
          >
            Refused target
          </li>
        </ul>
      </Demo>

      <Demo
        name="SORTABLE_CONTAINER"
        note="The list classes: an outline while an empty list, or an onto list's own space, is the target."
      >
        <div
          className={`${SORTABLE_CONTAINER} rounded-md border border-b4 p-3`}
          data-sortable-drop="inside"
        >
          <Text tone="muted">An empty list as the drop target</Text>
        </div>
      </Demo>
    </>
  );
}
