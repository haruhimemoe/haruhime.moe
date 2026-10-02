/**
 * @file tests/components/libraries/Markdown.test.tsx
 * @desc Markdown: GFM tables and task lists render, headings get ids for anchor links, raw HTML
 *       that could run (script, event handlers, javascript: links) is gone, and the output sits
 *       in Prose.
 * @author David @dvhsh (https://dvh.sh)
 * @created Fri Oct 2, 2026
 * @modified Fri Oct 2, 2026
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Markdown } from "@/components/libraries/Markdown";

describe("Markdown", () => {
  it("renders a GFM table and a fenced code block", () => {
    const { container } = render(
      <Markdown source={"| a | b |\n|---|---|\n| 1 | 2 |\n\n```sh\nbun add x\n```"} />,
    );
    expect(container.querySelector("table")).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "a" })).toBeInTheDocument();
    expect(container.querySelector("pre code")).toHaveTextContent("bun add x");
  });

  it("gives headings slug ids so the page's anchors work", () => {
    render(<Markdown source={"## Install\n\n### Server and client components"} />);
    expect(screen.getByRole("heading", { level: 2, name: "Install" })).toHaveAttribute(
      "id",
      "install",
    );
    expect(
      screen.getByRole("heading", { level: 3, name: "Server and client components" }),
    ).toHaveAttribute("id", "server-and-client-components");
  });

  it("drops scripts, event handlers and javascript: links", () => {
    const { container } = render(
      <Markdown
        source={
          '<script>alert(1)</script>\n\n<img src="x" onerror="alert(1)">\n\n[go](javascript:alert(1))\n\nsafe'
        }
      />,
    );
    expect(container.querySelector("script")).toBeNull();
    expect(container.querySelector("[onerror]")).toBeNull();
    // The sanitizer drops the href, so "go" is left as text, not a link.
    expect(screen.queryByRole("link", { name: "go" })).toBeNull();
    expect(container.innerHTML).not.toMatch(/javascript:/i);
    expect(screen.getByText("safe")).toBeInTheDocument();
  });

  it("keeps the picture and source tags a README banner uses", () => {
    const { container } = render(
      <Markdown source={'<picture><source srcset="a.svg"><img alt="x" src="b.svg"></picture>'} />,
    );
    expect(container.querySelector("img")).toHaveAttribute("src", "b.svg");
  });

  it("links an external URL in a new tab with rel noopener", () => {
    render(<Markdown source={"[npm](https://www.npmjs.com/package/@haruhimemoe/ui)"} />);
    const link = screen.getByRole("link", { name: "npm" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener");
  });
});
