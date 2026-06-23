import type { JSX, ReactNode } from "react";
import BodyClass from "@/components/home/BodyClass";
import PageScripts from "@/components/home/PageScripts";

/**
 * Shared shell for the static policy pages (privacy, terms, CSR, data
 * protection) — faithful to their PHP structure:
 * `section.static-pages.grey-section > .row.g-0 > .offset-xl-2.col-xl-7 > h1 + .static-content`.
 */
export default function StaticPage({
  pageClass,
  heading,
  contentClassName = "static-content",
  children,
}: {
  pageClass: string;
  heading: ReactNode;
  contentClassName?: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <>
      <BodyClass name={pageClass} />
      <section className="static-pages grey-section">
        <div className="row g-0">
          <div className="offset-xl-2 col-xl-7">
            <h1>{heading}</h1>
            <div className={contentClassName}>{children}</div>
          </div>
        </div>
      </section>
      <PageScripts />
    </>
  );
}
