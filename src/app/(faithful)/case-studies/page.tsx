/* eslint-disable @next/next/no-img-element, react/no-unescaped-entities */
import type { JSX } from "react";
import type { Metadata } from "next";
import BodyClass from "@/components/home/BodyClass";
import CaseStudiesScripts from "@/components/home/CaseStudiesScripts";
import { getCaseStudyCards } from "@/server/content/caseStudies";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/case-studies", { title: "Case Studies" });
}

const ARROW = (
  <div className="onHoverArrow">
    <div className="ArrowUI">
      <span className="arrowbg">
        <img src="/images/newRightArrow.svg" className="rightArrow" alt="Right Arrow" />
      </span>
    </div>
  </div>
);

/** Per-position layout for the 2×2 checkerboard (black/white, order, animations). */
const LAYOUTS = [
  { wrapper: "col-12 col-lg-6 order-1 order-lg-1 black-ui common-ui wow fadeInLeft", wrapperDur: "1.5s", inner: "service-details service-details-new wow ", innerDur: "2s", tagClass: "tag tag-new" },
  { wrapper: "col-12 col-lg-6 order-2 order-lg-2 white-ui common-ui", wrapperDur: undefined, inner: "service-details service-details-new wow fadeInRight ibs-section", innerDur: "1.5s", tagClass: "tag tag-new tag white-tag" },
  { wrapper: "col-12 col-lg-6 order-4 order-lg-3 white-ui common-ui wow fadeInLeft fadeInRight-lg", wrapperDur: "1.5s", inner: "service-details service-details-new wow erp-section", innerDur: "2s", tagClass: "tag tag-new tag white-tag" },
  { wrapper: "col-12 col-lg-6 order-3 order-lg-4 black-ui common-ui taj-section", wrapperDur: undefined, inner: "service-details service-details-new wow fadeInRight fadeInLeft-lg", innerDur: "1.5s", tagClass: "tag tag-new" },
] as const;

export default async function CaseStudiesPage(): Promise<JSX.Element> {
  const cards = await getCaseStudyCards();

  return (
    <>
      <BodyClass name="case-studies-page" />
      <link rel="preload" href="/images/case-studies/case-studies.png" as="image" />
      <link rel="preload" href="/images/case-studies/case-studies1.png" as="image" />
      <link rel="preload" href="/images/case-studies/case-studies2.png" as="image" />
      <link rel="preload" href="/images/case-studies/case-studies3.png" as="image" />

      <section className="animatio-option2 top-section pe-0 bg-black animation-section case-studies-animation">
        <div className="container-fluid p-0 case-studies-ui" style={{ height: "100%" }} id="animate-section">
          <div className="d-flex align-items-center" style={{ height: "100%" }}>
            <div className="left-div wow fadeIn bottom-placement" data-wow-duration="1s" data-wow-delay="0.1s">
              <h2>
                Not just showcases, but<br /> solutions that work<span className="square-dot"></span>
              </h2>
              <p>Stories of purposeful builds and lasting outcomes.</p>
            </div>
            <div id="canvas-container"></div>
          </div>
        </div>
      </section>

      <section className="case-studies-new">
        <div className="container-fluid p-0">
          <div className="row">
            {cards.map((c, i) => {
              const L = LAYOUTS[i] ?? LAYOUTS[i % LAYOUTS.length];
              return (
                <div key={c.slug} className={L.wrapper} data-wow-duration={L.wrapperDur}>
                  <a href={`/detailed-project?project=${c.slug}`} aria-label="" className="removeUnderline">
                    <div className={L.inner} data-wow-duration={L.innerDur}>
                      <h6>
                        {c.listHeading}
                        <span className="square-dot-small"></span>
                      </h6>
                      <h3 className="service-name service-name-new">{c.title}</h3>
                      <p>{c.shortDesc}</p>
                      <div className="d-flex flex-wrap gap-12">
                        {c.tags.map((t) => (
                          <span key={t} className={L.tagClass}>
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="mobile-lapi-img">
                        <img src={c.listImage} alt="Case Study" />
                      </div>
                      {ARROW}
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CaseStudiesScripts />
    </>
  );
}
