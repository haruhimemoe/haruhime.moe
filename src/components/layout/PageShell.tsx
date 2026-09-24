/**
 * @file src/components/layout/PageShell.tsx
 * @desc Page frame: skip link, header, #main landmark, footer.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

/**
 * @function PageShell
 * @param props {{ children: ReactNode }} the page
 * @returns {JSX.Element} the page inside the shared header, main landmark and footer
 */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only rounded-full bg-h2 px-4 py-2 font-bold text-c1 focus:not-sr-only focus:absolute focus:top-2 focus:left-2"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}
