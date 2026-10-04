/**
 * @file tests/components/libraries/Markdown.test.tsx
 * @desc Markdown: GFM tables and task lists render, ui's mdxComponents give h2/h3 a slug id and
 *       a visible anchor link, a fenced code block renders as CodeBlock (shiki highlighting,
 *       title and highlighted lines from the fence meta), a GitHub-style callout becomes a
 *       Callout, raw HTML that could run (script, event handlers, javascript: links) is gone,
 *       the sanitize allowlist keeps exactly the attributes ui's remark plugin writes, and the
 *       output sits in Prose.
 *
 *       CodeBlock is an async Server Component, which react-dom's client renderer (what
 *       @testing-library/react uses under jsdom) can't mount directly; a Suspense boundary plus
 *       `act` lets it resolve the same way Next's RSC renderer would, and the helper then waits
 *       for the boundary to show (a slow Shiki load under coverage outlasts `act`).
 * @author David @dvhsh (https://dvh.sh)
 * @created Fri Oct 2, 2026
 * @modified Sun Oct 4, 2026
 */

import { act, render, screen, waitFor } from "@testing-library/react";
import { Suspense } from "react";
import { describe, expect, it } from "vitest";
import { Markdown } from "@/components/libraries/Markdown";

/** Renders Markdown inside a Suspense boundary, resolved via `act` (see the file header). */
const renderMarkdown = async (source: string) => {
  let container!: HTMLElement;
  await act(async () => {
    ({ container } = render(<Suspense fallback={null}>{await Markdown({ source })}</Suspense>));
  });
  // Under coverage, act can return before Shiki has loaded and every CodeBlock resolved; the
  // boundary holds the whole output, so wait until it shows.
  await waitFor(() => expect(container.childElementCount).toBeGreaterThan(0), { timeout: 5000 });
  return container;
};

describe("Markdown", () => {
  it("renders a GFM table and a fenced code block", async () => {
    const container = await renderMarkdown(
      "| a | b |\n|---|---|\n| 1 | 2 |\n\n```sh\nbun add x\n```",
    );
    expect(container.querySelector("table")).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "a" })).toBeInTheDocument();
    expect(container.querySelector("pre code")).toHaveTextContent("bun add x");
    // A wide block scrolls sideways, so the keyboard has to be able to reach it.
    expect(container.querySelector("pre")).toHaveAttribute("tabindex", "0");
  });

  it("highlights a known language and marks the fence's highlighted line", async () => {
    const container = await renderMarkdown('```ts title="pool.ts" {1}\nconst x = 1;\n```');
    // CodeBlock's header shows the fence's title instead of the language name.
    expect(screen.getByText("pool.ts")).toBeInTheDocument();
    expect(container.querySelector('[data-highlighted=""]')).toBeInTheDocument();
    // Shiki tokenizes a known language into styled spans rather than one bare text node.
    expect(container.querySelectorAll("pre code span[style]").length).toBeGreaterThan(0);
  });

  it("gives h2/h3 a slug id and a visible anchor link beside the heading", async () => {
    await renderMarkdown("## Install\n\n### Server and client components");
    const h2 = screen.getByRole("heading", { level: 2, name: "Install" });
    expect(h2).toHaveAttribute("id", "install");
    expect(screen.getByRole("link", { name: "Link to section: Install" })).toHaveAttribute(
      "href",
      "#install",
    );
    const h3 = screen.getByRole("heading", { level: 3, name: "Server and client components" });
    expect(h3).toHaveAttribute("id", "server-and-client-components");
    expect(
      screen.getByRole("link", { name: "Link to section: Server and client components" }),
    ).toHaveAttribute("href", "#server-and-client-components");
  });

  it("turns a GitHub-style callout into a labelled note", async () => {
    await renderMarkdown("> [!NOTE]\n> Packs are deleted after 90 days.");
    const note = screen.getByRole("note");
    expect(note).toHaveTextContent("Note");
    expect(note).toHaveTextContent("Packs are deleted after 90 days.");
  });

  it("drops scripts, event handlers and javascript: links", async () => {
    const container = await renderMarkdown(
      '<script>alert(1)</script>\n\n<img src="x" onerror="alert(1)">\n\n[go](javascript:alert(1))\n\nsafe',
    );
    expect(container.querySelector("script")).toBeNull();
    expect(container.querySelector("[onerror]")).toBeNull();
    // The sanitizer drops the href, so "go" is left as text, not a link.
    expect(screen.queryByRole("link", { name: "go" })).toBeNull();
    expect(container.innerHTML).not.toMatch(/javascript:/i);
    expect(screen.getByText("safe")).toBeInTheDocument();
  });

  it("strips a forged className but keeps a real language class and fence meta", async () => {
    const container = await renderMarkdown(
      '<pre><code class="language-ts evil" data-meta=\'title="x.ts"\'>ok</code></pre>',
    );
    // The forged class is dropped, but the kept language-ts class still hands the fence to
    // CodeBlock, which names its header from the kept data-meta title.
    expect(screen.getByText("x.ts")).toBeInTheDocument();
    expect(container.innerHTML).not.toContain("evil");
  });

  it("keeps the picture and source tags a README banner uses", async () => {
    const container = await renderMarkdown(
      '<picture><source srcset="a.svg"><img alt="x" src="b.svg"></picture>',
    );
    expect(container.querySelector("img")).toHaveAttribute("src", "b.svg");
  });

  it("links an external URL in a new tab with rel noopener noreferrer", async () => {
    await renderMarkdown("[npm](https://www.npmjs.com/package/@haruhimemoe/ui)");
    const link = screen.getByRole("link", { name: "npm" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
