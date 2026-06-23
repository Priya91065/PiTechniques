/* eslint-disable @next/next/no-img-element, react/no-unescaped-entities */
import type { JSX } from "react";
import type { Metadata } from "next";
import BodyClass from "@/components/home/BodyClass";
import PageScripts from "@/components/home/PageScripts";
import { getActiveJobs } from "@/server/content/jobs";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/careers", { title: "Career" });
}

const FRAME_STYLE = `
.frame4-new-bgimage,
.frame9-new-bgimage,
.frame1-new-bgimage,
.frame2-new-bgimage,
.frame3-new-bgimage,
.frame14-new-bgimage,
.frame19-new-bgimage,
.frame12-new-bgimage {
    background-size: cover;
    background-position: center;
    height: calc(100% - 18px);
    width: 100%;
    background-repeat: no-repeat;
    border-radius: 12px;
}
.frame4-new-bgimage { background-image: url(/images/careers/team-members/frame_8.jpg); }
.frame9-new-bgimage { background-image: url(/images/careers/team-members/frame_24.jpg); }
.frame1-new-bgimage { background-image: url(/images/careers/team-members/frame_15.jpg); }
.frame2-new-bgimage { background-image: url(/images/careers/team-members/frame_16.jpg); }
.frame3-new-bgimage { background-image: url(/images/careers/team-members/frame_17.jpg); }
.frame14-new-bgimage { background-image: url(/images/careers/team-members/frame_14.jpg); }
.frame12-new-bgimage { background-image: url(/images/careers/team-members/frame_12.jpg); }
.frame19-new-bgimage { background-image: url(/images/careers/team-members/frame_19.jpg); }
.working-at-pi-new .row img { width: 100%; object-fit: cover; border-radius: 12px; }
.working-at-pi-new .row { --bs-gutter-x: 20px; --bs-gutter-y: 20px; }
@media (max-width: 1199px) {
    .working-at-pi-new .row img { border-radius: 8px; }
    .frame1-new-bgimage,.frame12-new-bgimage,.frame14-new-bgimage,.frame19-new-bgimage,.frame2-new-bgimage,.frame3-new-bgimage,.frame4-new-bgimage,.frame9-new-bgimage { height: calc(100% - 10px); border-radius: 8px; }
    .working-at-pi-new .row { --bs-gutter-x: 10px; --bs-gutter-y: 10px; }
    .working-at-pi-new .row img { margin-bottom: 10px; }
}
@media (max-width: 767px) {
    .working-at-pi-new .row>div { padding-left: 0px !important; padding-right: 0px !important; }
    .working-at-pi-new .row { --bs-gutter-x: 0; --bs-gutter-y: 0px; }
    .working-at-pi-new .marginTopspacing { margin-top: 20px !important; }
    .working-at-pi-new .row img { margin-bottom: 20px; width: 100%; }
}`;

export default async function CareersPage(): Promise<JSX.Element> {
  const jobs = await getActiveJobs();
  return (
    <>
      <BodyClass name="career-page" />
      <style>{FRAME_STYLE}</style>

      <section className="animatio-option2 top-section pe-0 bg-black animation-section">
        <div className="container-fluid p-0 case-studies-ui" style={{ height: "100%" }} id="animate-section">
          <div className="d-flex align-items-center" style={{ height: "100%" }}>
            <div className="left-div wow fadeIn" data-wow-duration="1s" data-wow-delay="0.1s">
              <h2>
                Let’s start with a<br />
                conversation<span className="square-dot"></span>
              </h2>
              <p>You talk, we’ll build it from there.</p>
            </div>
            <div id="canvas-container"></div>
          </div>
        </div>
      </section>

      <section className="who-we-are topSpacing140 grey-section bottomSpacing140">
        <div className="container-fluid p-0">
          <div className="row g-0">
            <div className="col-12 col-xl-9 col-xxl-8 offset-xl-2">
              <div className="row justify-content-between">
                <div className="col-12 col-xl-5 col-xxl-4  wow fadeInLeft" data-wow-duration="1s" data-wow-delay="0.3s">
                  <h4 className="small-title">
                    culture <span className="square-dot-small"></span>
                  </h4>
                  <h3 className="title-desc">
                    Working at<br /> Pi
                  </h3>
                </div>
                <div className="col-12  col-xl-7 col-xxl-7 wow fadeInRight" data-wow-duration="1s" data-wow-delay="0.3s">
                  <p>
                    Working at Pi Techniques isn’t about ticking boxes, it’s building technology with clarity and
                    purpose. For over three decades, we’ve built lasting client relationships by keeping technology
                    clear, simple, and effective. This philosophy extends to how we work together. Here, innovation
                    means finding smarter, practical solutions; collaboration means every voice counts; and growth
                    comes from learning by doing.{" "}
                  </p>
                  <p className="mb-0">
                    At Pi, you’re part of a place where we build on each other’s ideas, celebrate our collective growth
                    and work towards building a team that’s efficient, supportive, and forward-looking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="common-space140 bg-black" id="currentOpening">
        <div className="container-fluid p-0">
          <div className="row">
            <div
              className="col-12 col-lg-6 col-xl-5 col-xxl-4 offset-xl-1 offset-xxl-2 wow fadeInLeft"
              data-wow-duration="1s"
              data-wow-delay="0.1s"
            >
              <h4 className="small-title">
                opportunities<span className="square-dot-small"></span>
              </h4>
              <h3 className="title-desc">
                Our <br /> current<br /> openings
              </h3>
            </div>
            <div className="col-12 col-lg-6 col-xl-5">
              {jobs.map((job, index) => (
                <a
                  key={job.slug}
                  href={`/career-details?jobTitle=${job.slug}`}
                  className={`opening-box wow zoomIn job-item ${index >= 4 ? "hidden" : ""}`}
                  data-wow-delay={`${0.1 + index * 0.05}s`}
                >
                  <div>
                    <h3 className="service-name">{job.title}</h3>
                    <p className="service-info mb-0">{job.experience}</p>
                  </div>
                  <p className="arrow-white mb-0">
                    <span className="arrowbg">
                      <img src="/images/newRightArrow.svg" className="rightArrow" alt="Right Arrow" />
                    </span>
                  </p>
                </a>
              ))}
              {jobs.length > 4 && (
                <div style={{ marginTop: 40 }}>
                  <button
                    id="toggle-jobs"
                    data-more="/images/downNewArrow.svg"
                    data-less="/images/upNewArrow.svg"
                    className="btn-outline-secondary-new btnWithRightArrow downArrowAniamtion btn-outline-white"
                  >
                    <span className="btn-text">View more</span>
                    <span className="arrowbg">
                      <img src="/images/downNewArrow.svg" className="toggleArrow" alt="Arrow" />
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="working-at-pi working-at-pi-new">
        <div className="container-fluid p-0">
          <div className="">
            <div className="row">
              <div className="col-12 col-md-9">
                <div className="row row-img-height">
                  <div className="col-12 col-md-6">
                    <div className="frame1-new-bgimage d-none d-md-block"></div>
                    <img src="/images/careers/team-members/frame_15.jpg" className="img-fluid d-block d-md-none" alt="" />
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="row">
                      <div className="col-12 col-md-7">
                        <div className="frame2-new-bgimage d-none d-md-block"></div>
                        <img src="/images/careers/team-members/frame_16.jpg" className="img-fluid d-block d-md-none" alt="" />
                      </div>
                      <div className="col-12 col-md-5">
                        <img src="/images/careers/team-members/frame_17.jpg" className="img-fluid" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-md-4">
                    <img src="/images/careers/team-members/frame_13.jpg" className="img-fluid" alt="" />
                  </div>
                  <div className="col-12 col-md-4">
                    <img src="/images/careers/team-members/frame_4.jpg" className="img-fluid" alt="" />
                  </div>
                  <div className="col-12 col-md-4">
                    <img src="/images/careers/team-members/frame_18.jpg" className="img-fluid" alt="" />
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-3">
                <div className="frame4-new-bgimage d-none d-md-block"></div>
                <img src="/images/careers/team-members/frame_21.jpg" className="img-fluid d-block d-md-none" alt="" />
              </div>
              <div className="col-12 col-md-9 mt-0 marginTopspacing">
                <div className="row">
                  <div className="col-12 col-md-6">
                    <img src="/images/careers/team-members/frame_11.jpg" className="img-fluid d-none d-md-block" alt="" />
                    <img src="/images/careers/team-members/frame_22.jpg" className="img-fluid d-block d-md-none" alt="" />
                  </div>
                  <div className="col-12 col-md-6">
                    <img src="/images/careers/team-members/frame_10.jpg" className="img-fluid" alt="" />
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-md-4">
                    <div className="frame12-new-bgimage d-none d-md-block"></div>
                    <img src="/images/careers/team-members/frame_12.jpg" className="img-fluid d-block d-md-none" alt="" />
                  </div>
                  <div className="col-12 col-md-8">
                    <div className="row">
                      <div className="col-12 col-md-5">
                        <img src="/images/careers/team-members/frame_19.jpg" className="img-fluid" alt="" />
                      </div>
                      <div className="col-12 col-md-7">
                        <div className="frame14-new-bgimage d-none d-md-block"></div>
                        <img src="/images/careers/team-members/frame_24.jpg" className="img-fluid d-block d-md-none" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-3 mt-0">
                <div className="frame9-new-bgimage d-none d-md-block"></div>
                <img src="/images/careers/team-members/frame_14.jpg" className="img-fluid d-block d-md-none" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="section3 position-relative bg-black">
        <div className="banner-text banner-text-career">
          <div className="wow fadeIn" data-wow-delay="0.3s">
            <h2 className="mt-0 section-title">Connect with us</h2>
            <p className="text-white1">
              If you are passionate about innovating the future, we’d <br />love to hear from you!
            </p>
            <a href="/contact-us" className="btn-get btnWithRightArrow ">
              Contact us{" "}
              <span className="arrowbg">
                <img src="/images/newRightArrow.svg" className="rightArrow" alt="Right Arrow" />
              </span>
            </a>
          </div>
        </div>
      </section>

      <PageScripts extra={["/js/career-p5.js", "/js/career.js"]} />
    </>
  );
}
