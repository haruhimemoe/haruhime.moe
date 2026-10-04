/**
 * @file src/utils/changelog.ts
 * @desc Parses a Keep a Changelog 1.1.0 file into its Unreleased sections, its releases and its
 *       link definitions, so /changelog can show every repo's history. Lenient on purpose: it
 *       never throws, skips headings and sections it doesn't know, keeps each list item's
 *       Markdown (links, code, nested lists) as written, gives a bad date null and keeps only the
 *       first of a repeated version. A line only opens a fence when nothing after its opening run
 *       of backticks/tildes closes it on the same line (CommonMark: a backtick fence's info
 *       string can't contain backticks), and a `## ` heading always closes an open fence/item
 *       first, so an unclosed fence can swallow at most the rest of its own release. Also a
 *       release's anchor id and the Markdown one section renders from. Pure.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Sun Oct 4, 2026
 */

import { formatIsoDate } from "@/utils/date";

/** The six section names Keep a Changelog allows, in its order. */
export const SECTION_NAMES = [
  "Added",
  "Changed",
  "Deprecated",
  "Removed",
  "Fixed",
  "Security",
] as const;

/** One of the six section names. */
export type SectionName = (typeof SECTION_NAMES)[number];

/** One `### Name` block: its list items, each as the Markdown after the `- `. */
export type ChangeSection = { readonly name: SectionName; readonly items: readonly string[] };

/** One `## [x.y.z] - YYYY-MM-DD` block. `date` is null when missing or not a real date. */
export type Release = {
  readonly version: string;
  readonly date: string | null;
  readonly sections: readonly ChangeSection[];
};

/** A whole file. `references` are the `[x]: url` lines, kept so `[x]` in an item resolves. */
export type Changelog = {
  readonly unreleased: readonly ChangeSection[];
  readonly releases: readonly Release[];
  readonly references: readonly string[];
};

const UNRELEASED = /^##\s+\[?unreleased\]?\s*$/i;
const RELEASE = /^##\s+\[?v?(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)\]?(?:\s+(.*))?$/;
const DATE = /\b\d{4}-\d{2}-\d{2}\b/;
const OTHER_HEADING = /^#{1,2}\s/;
const SECTION = /^###\s+(.+?)\s*$/;
const ITEM = /^[-*]\s+(.*)$/;
const REFERENCE = /^\[[^\]]+\]:\s*\S/;
const FENCE = /^\s*(?:```|~~~)/;
const FENCE_OPEN = /^\s*(`{3,}|~{3,})/;
const HEADING_START = /^##\s/;

type DraftSection = { name: SectionName; items: string[] };

/**
 * @function opensFence
 * @param line {string} one line of the changelog
 * @returns {boolean} true only when the line's opening run of 3+ backticks or tildes isn't
 *   closed by another run of the same character, of equal or greater length, later on the line
 *   (an inline ```x``` doesn't open a fence)
 */
const opensFence = (line: string): boolean => {
  const open = FENCE_OPEN.exec(line);
  if (!open) return false;
  const run = open[1] as string;
  const rest = line.slice(open[0].length);
  const closer = new RegExp(`${run[0]}{${run.length},}`);
  return !closer.test(rest);
};

const isSectionName = (value: string): value is SectionName =>
  (SECTION_NAMES as readonly string[]).includes(value);

const realDate = (value: string | undefined): string | null => {
  if (value === undefined) return null;
  try {
    formatIsoDate(value);
    return value;
  } catch {
    return null;
  }
};

/**
 * @function parseChangelog
 * @param markdown {string} a CHANGELOG.md as fetched (LF or CRLF)
 * @returns {Changelog} its Unreleased sections, releases in file order and link definitions;
 *   empty lists for empty or junk input
 */
export const parseChangelog = (markdown: string): Changelog => {
  const unreleased: DraftSection[] = [];
  const releases: { version: string; date: string | null; sections: DraftSection[] }[] = [];
  const references: string[] = [];
  let block: DraftSection[] | null = null;
  let section: DraftSection | null = null;
  let item: string[] | null = null;
  let fenced = false;
  let blank = false;

  const closeItem = (): void => {
    const lines = item;
    item = null;
    if (!lines || !section) return;
    const text = lines.join("\n").trim();
    if (text) section.items.push(text);
  };

  const closeSection = (): void => {
    closeItem();
    const done = section;
    section = null;
    if (!done || !block || done.items.length === 0) return;
    const same = block.find((entry) => entry.name === done.name);
    if (same) same.items.push(...done.items);
    else block.push(done);
  };

  for (const raw of markdown.split("\n")) {
    const line = raw.endsWith("\r") ? raw.slice(0, -1) : raw;

    if (fenced) {
      if (HEADING_START.test(line)) {
        fenced = false;
      } else {
        item?.push(line);
        if (FENCE.test(line)) fenced = false;
        continue;
      }
    }

    if (REFERENCE.test(line)) {
      closeItem();
      references.push(line.trim());
      blank = false;
      continue;
    }

    const release = RELEASE.exec(line);
    if (UNRELEASED.test(line) || release || OTHER_HEADING.test(line)) {
      closeSection();
      const version = release?.[1];
      if (UNRELEASED.test(line)) {
        block = unreleased;
      } else if (
        version &&
        !releases.some((entry) => releaseAnchor(entry.version) === releaseAnchor(version))
      ) {
        const sections: DraftSection[] = [];
        releases.push({ version, date: realDate(DATE.exec(release?.[2] ?? "")?.[0]), sections });
        block = sections;
      } else {
        block = null;
      }
      blank = false;
      continue;
    }

    const heading = SECTION.exec(line)?.[1];
    if (heading !== undefined) {
      closeSection();
      section = block && isSectionName(heading) ? { name: heading, items: [] } : null;
      blank = false;
      continue;
    }

    if (line.trim() === "") {
      item?.push("");
      blank = true;
      continue;
    }

    const start = ITEM.exec(line);
    if (start && section) {
      closeItem();
      const first = start[1] ?? "";
      item = [first];
      if (opensFence(first)) fenced = true;
      blank = false;
      continue;
    }

    if (item && (!blank || /^\s/.test(line))) {
      item.push(line);
      if (opensFence(line)) fenced = true;
    } else {
      closeItem();
    }
    blank = false;
  }
  closeSection();

  return { unreleased, releases, references };
};

/**
 * @function releaseAnchor
 * @param version {string} a release's version, e.g. "0.9.0"
 * @returns {string} its anchor id on the repo page, e.g. "v0-9-0"
 */
export const releaseAnchor = (version: string): string =>
  `v${version.replace(/[^0-9A-Za-z]+/g, "-")}`;

/**
 * @function sectionMarkdown
 * @param section {ChangeSection} one section
 * @param references {readonly string[]} the file's link definitions (default none)
 * @returns {string} the items as a Markdown list, then the definitions so `[x]` links resolve
 */
export const sectionMarkdown = (
  section: ChangeSection,
  references: readonly string[] = [],
): string => {
  const list = section.items.map((entry) => `- ${entry}`).join("\n");
  return references.length ? `${list}\n\n${references.join("\n")}` : list;
};
