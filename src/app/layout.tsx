/**
 * @file src/app/layout.tsx
 * @desc Root layout: Nunito font variable, site metadata (next-kit siteMetadata: title template,
 *       description, Open Graph with the site image), dark body, the SiteShell frame.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Mon Sep 28, 2026
 */

import { siteMetadata } from "@haruhimemoe/next-kit/seo";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import type { ReactNode } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { SEO_SITE } from "@/constants/seo";
import "./globals.css";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", display: "swap" });

export const metadata: Metadata = siteMetadata(SEO_SITE);

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={nunito.variable}>
      <body className="bg-b5 font-sans text-c2 antialiased">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
