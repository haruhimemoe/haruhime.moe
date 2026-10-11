/**
 * @file src/app/layout.tsx
 * @desc Root layout: Nunito font variable, site metadata (next-kit siteMetadata: title template,
 *       description, Open Graph with the site image), dark body, the SiteShell frame.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Sun Oct 11, 2026
 */

import { pwaMetadata, pwaViewport, ServiceWorkerRegister } from "@haruhimemoe/next-kit/pwa";
import { siteMetadata } from "@haruhimemoe/next-kit/seo";
import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import type { ReactNode } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { PWA } from "@/constants/pwa";
import { SEO_SITE } from "@/constants/seo";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", display: "swap" });

export const metadata: Metadata = { ...siteMetadata(SEO_SITE), ...pwaMetadata(PWA) };

/** The page color as the browser's theme color, the app's color scheme, zoom left on. */
export const viewport: Viewport = pwaViewport(PWA);

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale} className={nunito.variable}>
      <body className="bg-b5 font-sans text-c2 antialiased">
        <NextIntlClientProvider>
          <SiteShell>{children}</SiteShell>
        </NextIntlClientProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
