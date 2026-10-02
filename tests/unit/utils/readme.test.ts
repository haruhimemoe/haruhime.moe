/**
 * @file tests/unit/utils/readme.test.ts
 * @desc README transforms: the leading banner paragraph and title go (the page has its own header),
 *       relative links point at the file on GitHub and relative images at the raw file; absolute
 *       links, anchors and mailto stay; prepareReadme runs both.
 * @author David @dvhsh (https://dvh.sh)
 * @created Fri Oct 2, 2026
 * @modified Fri Oct 2, 2026
 */

import { describe, expect, it } from "vitest";
import { prepareReadme, rewriteRelativeUrls, stripBanner, stripTitle } from "@/utils/readme";

const BANNER = `<p align="center"><a href="https://github.com/haruhimemoe/ui"><picture><source media="(prefers-color-scheme: light)" srcset="https://www.haruhime.moe/brand/repos/ui-banner-on-light.svg"><img alt="ui" src="https://www.haruhime.moe/brand/repos/ui-banner.svg"></picture></a></p>

# @haruhimemoe/ui

Body.`;

describe("stripBanner", () => {
  it("removes a leading centered paragraph and the blank lines after it", () => {
    expect(stripBanner(BANNER)).toBe("# @haruhimemoe/ui\n\nBody.");
  });

  it("removes a banner that spans several lines", () => {
    const md = `<p align="center">\n  <img src="x.svg">\n</p>\n\n# Title`;
    expect(stripBanner(md)).toBe("# Title");
  });

  it("leaves a README that starts with a heading alone", () => {
    expect(stripBanner('# Title\n\n<p align="center">later</p>')).toBe(
      '# Title\n\n<p align="center">later</p>',
    );
  });
});

describe("stripTitle", () => {
  it("removes a leading # title line and the blank lines after it", () => {
    expect(stripTitle("# @haruhimemoe/ui\n\nBody.")).toBe("Body.");
  });

  it("leaves a README that starts with prose or an h2 alone", () => {
    expect(stripTitle("Body first.\n\n# later")).toBe("Body first.\n\n# later");
    expect(stripTitle("## Install")).toBe("## Install");
  });
});

describe("rewriteRelativeUrls", () => {
  it("points a relative link at the file on GitHub", () => {
    expect(rewriteRelativeUrls("see [the codec](docs/pack-key.md)", "pool")).toBe(
      "see [the codec](https://github.com/haruhimemoe/pool/blob/main/docs/pack-key.md)",
    );
  });

  it("drops a leading ./ and points a relative image at the raw file", () => {
    expect(rewriteRelativeUrls("![preview](./assets/preview.png)", "brand")).toBe(
      "![preview](https://raw.githubusercontent.com/haruhimemoe/brand/main/assets/preview.png)",
    );
  });

  it("keeps absolute links, anchors and mailto", () => {
    const md =
      "[a](https://x.y/z) [b](#install) [c](mailto:contact@haruhime.moe) ![d](http://x.y/i.png)";
    expect(rewriteRelativeUrls(md, "ui")).toBe(md);
  });

  it("keeps a link's title and handles several on one line", () => {
    expect(rewriteRelativeUrls('[a](CHANGELOG.md "log") and [b](LICENSE)', "osu")).toBe(
      '[a](https://github.com/haruhimemoe/osu/blob/main/CHANGELOG.md "log") and [b](https://github.com/haruhimemoe/osu/blob/main/LICENSE)',
    );
  });
});

describe("prepareReadme", () => {
  it("strips the banner and the title and rewrites links", () => {
    expect(prepareReadme(`${BANNER}\n\n[log](CHANGELOG.md)`, "ui")).toBe(
      "Body.\n\n[log](https://github.com/haruhimemoe/ui/blob/main/CHANGELOG.md)",
    );
  });
});
