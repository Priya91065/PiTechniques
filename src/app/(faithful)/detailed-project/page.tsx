/* eslint-disable @next/next/no-img-element, react/no-unescaped-entities */
import type { JSX } from "react";
import type { Metadata } from "next";
import BodyClass from "@/components/home/BodyClass";
import PageScripts from "@/components/home/PageScripts";
import { getCaseStudyBySlug } from "@/server/content/caseStudies";

export const metadata: Metadata = { title: "Case Studies" };

/** Prefix an asset path from the JSON ("images/…") with the public root. */
const asset = (p: string): string => (p.startsWith("/") ? p : `/${p}`);

/** Convert a PHP case-study link to the faithful Next route. */
function projectLink(link: string): string {
  if (!link || link === "#") return "#";
  const m = link.match(/project=([^&]+)/);
  return m ? `/detailed-project?project=${m[1]}` : "#";
}

/** nl2br — render text with "\n" turned into <br/> (faithful to the PHP). */
function NlToBr({ text }: { text: string }): JSX.Element {
  const parts = text.split("\n");
  return (
    <>
      {parts.map((p, i) => (
        <span key={i}>
          {p}
          {i < parts.length - 1 ? <br /> : null}
        </span>
      ))}
    </>
  );
}

export default async function DetailedProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string }>;
}): Promise<JSX.Element> {
  const { project = "" } = await searchParams;
  const data = await getCaseStudyBySlug(project);

  if (!data) {
    return (
      <>
        <BodyClass name="case-studies-details" />
        <link rel="stylesheet" href="/css/project-details.css" precedence="pi-original" />
        <section className="detailed-top-section grey-section">
          <div className="container-fluid p-0" style={{ padding: "120px 0", textAlign: "center" }}>
            <h3 className="title">Case study not found</h3>
            <p className="short-desc">
              <a href="/case-studies" className="removeUnderline">
                Back to case studies
              </a>
            </p>
          </div>
        </section>
        <PageScripts />
      </>
    );
  }

  const featureGridClass = ["feature-grid", data.featureGridVariant].filter(Boolean).join(" ");

  const previousLink = projectLink(data.previous.link);
  const nextLink = projectLink(data.next.link);

  return (
    <>
      <BodyClass name="case-studies-details" />
      <link rel="stylesheet" href="/css/project-details.css" precedence="pi-original" />

      <section className="detailed-top-section grey-section">
        <div className="container-fluid p-0">
          <div className="row justify-content-center first-section">
            <div className="col-12 col-md-11 col-lg-9  col-xl-5  wow fadeInLeft" data-wow-duration="1.5s">
              <img className="logo-image" src={asset(data.topSection.logo)} alt="case studies logo" />
              <h3 className="title">
                <NlToBr text={data.topSection.title} />
              </h3>
              <p className="short-desc mb-40">
                <NlToBr text={data.topSection.shortDesc} />
              </p>
              <div className="d-flex flex-wrap ">
                {data.topSection.tags.map((tag) => (
                  <span key={tag} className="chip white-chip">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="project-info d-xl-none">
                <div className="container-fluid p-0">
                  <div className="row justify-content-center align-items-center">
                    <div className="col-12 wow fadeInLeft" data-wow-duration="1.5s">
                      <div className="row">
                        <div className="col-12 col-md-6 col-xl-5">
                          <div className="d-flex align-items-center">
                            <img src="/images/case-studies/industry-icon.svg" alt="" />
                            <span className="font-19">Industry</span>
                          </div>
                          <p className="font-19 mt-1 mb-0 mobile-margins">
                            {data.projectInfo.projectDetails.industry}
                          </p>
                        </div>
                        <div className="col-12 col-md-6 col-xl-5">
                          <div className="d-flex align-items-center">
                            <img src="/images/case-studies/headquarters.svg" alt="" />
                            <span className="font-19">Headquarters</span>
                          </div>
                          <p className="font-19 mt-1 mb-0">{data.projectInfo.projectDetails.headquarters}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-12 col-xl-5 wow fadeInRight" data-wow-duration="1.5s">
              <img src={asset(data.topSection.img)} className="w-100 mbm-40 laptop-right" alt="case studies" />
            </div>
          </div>
          <div className="project-info d-none d-xl-block">
            <div className="container-fluid p-0">
              <div className="row justify-content-center align-items-center">
                <div className="col-12 col-xl-11 offset-xl-1  wow fadeInLeft" data-wow-duration="1.5s">
                  <div className="row mt-4">
                    <div className="col-6 col-md-3">
                      <div className="d-flex align-items-center">
                        <img src="/images/case-studies/industry-icon.svg" alt="" />
                        <span className="font-19">Industry</span>
                      </div>
                      <p className="font-19 mt-1">{data.projectInfo.projectDetails.industry}</p>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className="d-flex align-items-center">
                        <img src="/images/case-studies/headquarters.svg" alt="" />
                        <span className="font-19">Headquarters</span>
                      </div>
                      <p className="font-19 mt-1">{data.projectInfo.projectDetails.headquarters}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black challenge-sec">
        <div className="container-fluid p-0">
          <div className="row ">
            <div className="col-12 col-xl-4 col-xxl-3 offset-xl-2 pe-0 mb-mob-40 wow fadeInLeft" data-wow-duration="1.5s">
              <h3 className="medium-font">The challenge </h3>
              <p className="font-19 mb-0">{data.challenges.shortInfo}</p>
              {data.challenges.lists.length > 0 && (
                <ul className="mb-0">
                  {data.challenges.lists.map((list, i) => (
                    <li key={i}>{list}</li>
                  ))}
                </ul>
              )}
            </div>
            <div className="col-12 col-xl-4 col-xxl-3 ps-xl-0 wow fadeInRight " data-wow-duration="1.5s">
              <h3 className="medium-font">What we did </h3>
              <p className="font-19 mb-0">{data.challenges.background}</p>
            </div>
            <div className="offset-md-2 d-none d-xl-block"></div>
          </div>
        </div>
      </section>

      <section className="pisolution grey-section">
        <div className="container-fluid p-0">
          <div className="row">
            <div className="col-12 col-md-12 col-xl-9 offset-xl-2 wow" data-wow-duration="1.5s">
              <h3 className="medium-font mb-3">The Pi Solution </h3>
              <p className="font-19 mb-0">{data.piSolution.details}</p>
            </div>
          </div>
          {data.piSolution.solutions && (
            <div className="row gap-3 mt-60 solution">
              {data.piSolution.solutions.map((solution) => (
                <div key={solution.title} className="col-12 col-md-12 col-xl-3 wow" data-wow-duration="1.5s">
                  <h3 className="body-medium">{solution.title} </h3>
                  <span className="font-19">{solution.subTitle}</span>
                  <ul>
                    {solution.list.map((list, i) => (
                      <li key={i}>{list}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="key-feature grey-section">
        <div className="container-fluid p-0">
          <div className="row">
            <div className="col-12 col-md-12 col-xl-9 offset-xl-2 wow">
              <h3 className="medium-font mb-0">Key features </h3>
              <div className={featureGridClass}>
                {data.keyFeature.map((feature, i) => (
                  <div key={i}>
                    <img src={asset(feature.img)} alt="" />
                    <p className="font-subtitle mt-3 mb-0">{feature.feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="long-term-impact grey-section">
        <div className="container-fluid p-0">
          <div className="row">
            <div className="col-12 col-md-12 col-xl-10 offset-xl-2 wow">
              <h3 className="medium-font mb-1">Long-term impact </h3>
              <p className="font-19 mb-0">{data.longTermImpact.title}</p>
            </div>
            <div className="col-12 col-md-12 col-xl-10 offset-xl-2 wow">
              <div className="impact-grid">
                {data.longTermImpact.impact.map((impact, i) => (
                  <div key={i}>
                    <img src={asset(impact.img)} alt="" />
                    <p className="short-desc mb-3">{impact.title}</p>
                    <p className="font-subtitle mb-0">{impact.subTitle}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="get-in-touch bg-black">
        <div className="col-12 col-md-12 col-xl-12 offset-xl-0 col-xxl-8 offset-xxl-2 custom-col">
          <div className="text-center">
            <h4 className="small-title ">
              Connect with us<span className="square-dot-small"></span>
            </h4>
            <p className="medium-font">
              Let’s talk about building the right digital transformation <br /> for your business.
            </p>
            <a href="/contact-us" className="btn-get btnWithRightArrow">
              Connect with us
              <span className="arrowbg">
                <img src="/images/newRightArrow.svg" className="rightArrow" alt="Right Arrow" />
              </span>
            </a>
          </div>

          <div className={`case-nav ${previousLink === "#" ? "justify-content-end" : ""}`}>
            <a href={previousLink} className="arrow prev-arrow">
              <img src="/images/white_arrow_left.svg" alt="Left arrow" className="img-fluid" />
              <p className="font-14">
                Previous <br />
                case study
              </p>
            </a>
            <a href={nextLink} className="arrow next-arrow">
              <p className="font-14 text-end">
                Next <br />
                case study
              </p>
              <img src="/images/white_arrow_right.svg" alt="Left arrow" className="img-fluid" />
            </a>
          </div>
        </div>
      </section>

      <PageScripts />
    </>
  );
}
