/**
 * @file tests/unit/utils/content-markdown.test.ts
 * @desc Pins CONTENT_MARKDOWN's shape: the site's origin, and ui's mdxMarkdownTransforms turning
 *       `<Figure>` into a Markdown image in the .md mirrors.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Sun Oct 4, 2026
 */

import { mdxToMarkdown } from "@haruhimemoe/next-kit/docs";
import { expect, it } from "vitest";
import { CONTENT_MARKDOWN } from "@/utils/content-markdown";

it("turns ui's MDX components into Markdown in the mirrors", () => {
  const md = mdxToMarkdown('<Figure src="/a.png" alt="A" width={1} height={1} caption="C" />', {
    title: "T",
    ...CONTENT_MARKDOWN,
  });
  expect(md).toContain(`![A](${CONTENT_MARKDOWN.siteUrl}/a.png "C")`);
});
