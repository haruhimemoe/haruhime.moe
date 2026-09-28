/**
 * @file next.config.ts
 * @desc Next.js config: strict mode, security headers on every static page, no X-Powered-By, and
 *       one rewrite so the .github repo's README banners load. Every page is static; there are no
 *       API routes.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Mon Sep 28, 2026
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
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
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
