/**
 * @file src/components/showcase/BracketDemos.tsx
 * @desc /ui's Bracket group: an 8-team single elimination bracket part played (quarterfinals
 *       done, one semifinal done, a bye), shown whole by BracketView, one match by
 *       BracketMatchCard, its columns by bracketColumns and its unknown sides by sideLabel.
 * @author David @dvhsh (https://dvh.sh)
 * @created Fri Oct 9, 2026
 * @modified Fri Oct 9, 2026
 */

import {
  type BracketLike,
  BracketMatchCard,
  type BracketMatchLike,
  BracketView,
  bracketColumns,
  sideLabel,
} from "@haruhimemoe/ui";
import { Demo } from "@/components/showcase/Demo";

const NAMES: Readonly<Record<string, string>> = {
  t1: "Haruhi Fanclub",
  t2: "SOS Brigade",
  t3: "Computer Society",
  t4: "Literature Club",
  t5: "North High",
  t6: "Kouyouen Academy",
  t7: "Tsuruya Family",
};

const seed = (n: number, entrant: string | null): BracketMatchLike["a"] => ({
  entrant,
  settled: true,
  source: { kind: "seed", seed: n },
});

const from = (kind: "winner" | "loser", match: string, entrant: string | null = null) => ({
  entrant,
  settled: entrant !== null,
  source: { kind, match },
});

const done = (
  code: string,
  round: string,
  a: BracketMatchLike["a"],
  b: BracketMatchLike["b"],
  scoreA: number,
  scoreB: number,
): BracketMatchLike => ({
  code,
  round,
  a,
  b,
  status: "done",
  scoreA,
  scoreB,
  winner: scoreA > scoreB ? "a" : "b",
});

const SF2: BracketMatchLike = {
  code: "M6",
  round: "SF",
  a: from("winner", "M3", "t3"),
  b: from("winner", "M4", "t2"),
  status: "pending",
  scoreA: null,
  scoreB: null,
  winner: null,
};

/** Eight seeds, seed 8 missing (a bye), the quarterfinals and one semifinal played. */
const BRACKET: BracketLike = {
  format: "single",
  rounds: [
    { code: "QF", name: "Quarterfinals", side: "winners", order: 0 },
    { code: "SF", name: "Semifinals", side: "winners", order: 1 },
    { code: "F", name: "Final", side: "winners", order: 2 },
  ],
  matches: [
    { ...done("M1", "QF", seed(1, "t1"), seed(8, null), 0, 0), status: "bye", winner: "a" },
    done("M2", "QF", seed(4, "t4"), seed(5, "t5"), 5, 3),
    done("M3", "QF", seed(3, "t3"), seed(6, "t6"), 5, 4),
    done("M4", "QF", seed(2, "t2"), seed(7, "t7"), 5, 1),
    done("M5", "SF", from("winner", "M1", "t1"), from("winner", "M2", "t4"), 5, 2),
    SF2,
    {
      code: "M7",
      round: "F",
      a: from("winner", "M5", "t1"),
      b: from("winner", "M6"),
      status: "pending",
      scoreA: null,
      scoreB: null,
      winner: null,
    },
  ],
};

/**
 * @function BracketDemos
 * @returns {JSX.Element} the BracketView, BracketMatchCard, bracketColumns and sideLabel demos
 */
export function BracketDemos() {
  const columns = bracketColumns(BRACKET);
  return (
    <>
      <Demo
        name="BracketView"
        note="A @haruhimemoe/tourney Bracket as columns of match cards, one per round, scrolling sideways in its own box. Here SOS Brigade is highlighted and seed 8 is a bye."
      >
        <BracketView bracket={BRACKET} names={NAMES} highlight="t2" aria-label="Sample bracket" />
      </Demo>
      <Demo
        name="BracketMatchCard"
        note="One match: both sides, their scores and the winner in bold. The final's second side is still open, so it reads where it comes from."
      >
        <div className="flex flex-wrap gap-4">
          <BracketMatchCard match={SF2} names={NAMES} />
          <BracketMatchCard match={BRACKET.matches[6] as BracketMatchLike} names={NAMES} />
        </div>
      </Demo>
      <Demo
        name="bracketColumns"
        note="The layout BracketView draws from: one block per bracket side, one column per round, matches in bracket order."
      >
        <ul className="text-c2 text-sm">
          {columns.flatMap((block) =>
            block.rounds.map((round) => (
              <li key={round.code}>
                {block.side}, {round.name}: {round.matches.map((m) => m.code).join(", ")}
              </li>
            )),
          )}
        </ul>
      </Demo>
      <Demo name="sideLabel" note="What an unknown side reads as, from where it comes from.">
        <ul className="text-c2 text-sm">
          <li>{sideLabel({ kind: "seed", seed: 3 })}</li>
          <li>{sideLabel({ kind: "winner", match: "M5" })}</li>
          <li>{sideLabel({ kind: "loser", match: "M2" })}</li>
        </ul>
      </Demo>
    </>
  );
}
