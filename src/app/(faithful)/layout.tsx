import type { JSX, ReactNode } from "react";
import OriginalHead from "@/components/home/OriginalHead";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";

/**
 * Shared shell for the faithful inner pages (services, careers, case studies,
 * career details). Mirrors header.php + footer.php: the original stylesheets,
 * the faithful header, the black slide-up `.loader` overlay present on every
 * PHP page, the page content, then the faithful footer. Each page supplies its
 * own <BodyClass>, markup and <PageScripts>.
 */
export default function FaithfulLayout({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <>
      <OriginalHead />
      <Header />
      <div className="loader" data-js-el="loader"></div>
      {children}
      <Footer />
    </>
  );
}
