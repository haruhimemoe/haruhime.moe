/**
 * @file next.config.ts
 * @desc Next.js config: MDX page extensions (content/legal runs through @haruhimemoe/ui/remark,
 *       passed by module name since Turbopack only takes MDX plugins that way), strict mode,
 *       security headers on every static page, no X-Powered-By, one rewrite so the .github repo's
 *       README banners load, the legal MDX traced into /llms-full.txt (it revalidates daily), and
 *       next-kit's rewrite that serves each legal page's Markdown mirror
 *       at /legal/<slug>.md. Every page is static; there are no API routes.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Sun Oct 4, 2026
 */

import { contentRewrites } from "@haruhimemoe/next-kit/docs";
import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: { remarkPlugins: ["@haruhimemoe/ui/remark"] },
});

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  reactStrictMode: true,
  poweredByHeader: false,
  // /llms-full.txt rebuilds once a day on the server and reads content/legal's MDX each time, so
  // the files ship with it.
  outputFileTracingIncludes: { "/llms-full.txt": ["./content/legal/*.mdx"] },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          // No nonces or hashes, so Next's inline scripts still run and every page stays static.
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'none'; base-uri 'none'; object-src 'none'; form-action 'none'",
          },
        ],
      },
    ];
  },
  // Next's file server won't serve a public file whose name starts with a dot (it answers 404 or
  // 500), so /brand/repos/.github-banner.svg and its light twin never load from public/. The
  // .github repo draws the haruhime brand, the same as haruhime.moe, so its URLs are served from
  // haruhime.moe's byte-identical files. A test checks the pairs still match.
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/brand/repos/.github-:file", destination: "/brand/repos/haruhime.moe-:file" },
      ],
      // A dynamic segment can't end in ".md", so /legal/x.md maps to the route at /legal/x/md.
      afterFiles: [...contentRewrites()],
      fallback: [],
    };
  },
};

export default withMDX(nextConfig);
