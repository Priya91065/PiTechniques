import type { JSX, ReactNode } from "react";
import BodyClass from "@/components/home/BodyClass";
import PageScripts from "@/components/home/PageScripts";
import styles from "@/components/home/StaticPage.module.css";

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
  html,
}: {
  pageClass: string;
  heading: ReactNode;
  contentClassName?: string;
  children?: ReactNode;
  /** When provided, the content area renders this HTML (CMS-driven) instead of children. */
  html?: string;
}): JSX.Element {
  const contentClass = `${contentClassName} ${styles.staticContent}`;
  return (
    <>
      <BodyClass name={pageClass} />
      <section className={`static-pages grey-section ${styles.staticPages}`}>
        <div className="row g-0">
          <div className="offset-xl-2 col-xl-7">
            <h1>{heading}</h1>
            {html != null ? (
              <div className={contentClass} dangerouslySetInnerHTML={{ __html: html }} />
            ) : (
              <div className={contentClass}>{children}</div>
            )}
          </div>
        </div>
      </section>
      <PageScripts />
    </>
  );
}
