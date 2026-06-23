import type { JSX, ReactNode } from "react";
import Providers from "@/lib/Providers";
import Header from "@/components/navigation/Header";
import Footer from "@/components/footer/Footer";
import RevealController from "@/components/common/RevealController";

/**
 * Layout for the pre-existing styled-components marketing routes
 * (about, services, careers, …). Keeps the MUI / styled-components
 * provider stack and the styled chrome that those pages were built against.
 * The faithful homepage lives at the app root and deliberately stays
 * outside this provider stack.
 */
export default function SiteLayout({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <Providers>
      <RevealController>
        <Header />
        <main>{children}</main>
        <Footer />
      </RevealController>
    </Providers>
  );
}
