/* eslint-disable @next/next/no-img-element, react/no-unescaped-entities */
import type { JSX } from "react";
import type { Metadata } from "next";
import BodyClass from "@/components/home/BodyClass";
import PageScripts from "@/components/home/PageScripts";
import { industries, type TeamMember } from "@/constants/aboutTeam";
import { getTeamGroups } from "@/server/content/team";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/about", { title: "About Us" });
}

const ABOUT_STYLE = `
.modal-close-ui{ background: transparent; padding: 0; border: 0; }
.aboutpage .team-details .mb-0 { height: 100%; flex-direction: column; display: flex; justify-content: space-between; }
.aboutpage .team-details .team-members-block { align-items: flex-start !important; }
img.omnichannel{ height: 110px !important; object-fit: contain; object-position: left; }
@media only screen and (max-width:767px){
  img.lotties{ width: 89px !important; height: 78px !important; }
  img.omnichannel{ height: 78px !important; }
}`;

/** Renders a line of text where "\n" becomes a <br/> (faithful to the markup). */
function withBreaks(text: string): JSX.Element {
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

function TeamCard({ m }: { m: TeamMember }): JSX.Element {
  return (
    <div className={m.col}>
      <div className={`card ${m.cardMb0 ? "mb-0 " : ""}wow fadeInUp`} data-wow-delay="0.1s">
        {m.img ? (
          <img src={m.img} className="card-img-top w-100" alt="Our Team" />
        ) : (
          <>
            <img
              src={m.imgDesktop}
              className={`card-img-top w-100 d-none ${m.dualBp === "xl" ? "d-xl-block" : "d-md-block"}`}
              alt="Our Team"
            />
            <img
              src={m.imgMobile}
              className={`card-img-top w-100 d-block ${m.dualBp === "xl" ? "d-xl-none" : "d-md-none"}`}
              alt="Our Team"
            />
          </>
        )}
        <div className="team-details">
          <div className="mb-0">
            <div className="d-flex justify-content-between align-items-center team-members-block">
              <p className="team-name">{m.name}</p>
              {m.linkedin && (
                <a href={m.linkedin} target="_blank" rel="noreferrer" title="linkedin" className="linkedin">
                  <img src="/images/about/linkedin.svg" className="rounded-0" alt="Linkedin" />
                </a>
              )}
            </div>
            <p className="title-info">{m.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function AboutPage(): Promise<JSX.Element> {
  const { leaders, executives } = await getTeamGroups();
  return (
    <>
      <BodyClass name="aboutpage" />
      <style>{ABOUT_STYLE}</style>

      <div className="hidebody">
        <section className="animatio-option2 top-section pe-0 bg-black animation-section">
          <div className="container-fluid p-0 case-studies-ui" style={{ height: "100%" }} id="animate-section">
            <div className="d-flex align-items-center" style={{ height: "100%" }}>
              <div className="left-div wow fadeIn bottom-placement" data-wow-duration="1s" data-wow-delay="0.1s">
                <h2>
                  We keep it precise and <br /> simple<span className="square-dot"></span>
                </h2>
                <p className="banner-subtitle">Three decades of building with care and clarity.</p>
              </div>
              <div id="canvas-container"></div>
            </div>
          </div>
        </section>

        <section className="common-space160 rooted-info grey-section">
          <div className="container-fluid p-0">
            <div className="row justify-content-between-small g-0 paragraph-bottom-space">
              <div className="col-12 col-lg-5 col-xl-5 offset-xl-2 wow fadeInLeft" data-wow-duration="2s">
                <div className="section-name">
                  <h4 className=" small-title">
                    ABOUT US<span className="square-dot-small"></span>
                  </h4>
                  <h3 className="title-desc">
                    Rooted in experience.<br />
                    Driven by innovation.
                  </h3>
                </div>
                <p className="title-info">
                  At Pi Techniques, we've been solving problems with tech since 1992. Beginning as a small support firm
                  for individuals and home offices, and growing into a trusted, full-spectrum technology partner for
                  modern businesses.
                </p>
                <p className="title-info">
                  Over the years, we’ve expanded into software development, web technologies, and IT infrastructure
                  services. We have been delivering solutions that are tailored, reliable, and future-ready. Many of our
                  clients have been with us for decades, a testament to our clear, simple, and client-first approach. No
                  jargon, just measurable results.
                </p>
                <p className="title-info mb-0">
                  Backed by decades of experience, we create technology shaped around your business needs — reliable,
                  scalable, and future-ready. Solutions that help grow with your business and keep pace with a
                  fast-moving tech world.
                </p>
              </div>
              <div className="col-12 col-lg-6 col-xl-4 offset-xl-0 wow fadeInRight p-0" data-wow-duration="2s ">
                <div className="about-newoffice"></div>
              </div>
            </div>
          </div>
        </section>

        <section className="common-space160 bg-black">
          <div className="container-fluid p-0">
            <div className="row align-items-center">
              <div
                className="col-12 col-lg-11 col-xl-9 offset-xl-2 col-xxl-9 offset-xxl-2 wow fadeInUp"
                data-wow-duration="1.5s"
                data-wow-delay="0.1s"
              >
                <h4 className="small-title">
                  key industries<span className="square-dot-small"></span>
                </h4>
                <h3 className="title-desc">Technology crafted for every sector</h3>
              </div>
            </div>
            <div className="all-services all-services-newUI">
              <div className="row g-0">
                <div className="col-12 col-lg-12 col-xl-9 offset-xl-2 col-xxl-9 offset-xxl-2">
                  <div className="d-flex flex-wrap customgap">
                    {industries.map((ind) => (
                      <div key={ind.title} className="service-details wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s">
                        <div>
                          <img
                            src={`/images/about-lottie/${ind.img}`}
                            className={`h-auto lotties${ind.extraClass ? " " + ind.extraClass : ""}`}
                            alt=""
                            width={125}
                            height={110}
                          />
                        </div>
                        <h3 className="service-name">{withBreaks(ind.title)}</h3>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="common-space160 adapting grey-section">
          <div className="container-fluid p-0">
            <div className="row justify-content-between g-0">
              <div
                className="col-12 col-md-12 col-xl-3 col-xxl-3 offset-xl-2 offset-xxl-2 wow fadeInLeft"
                data-wow-duration="1.5s"
                data-wow-delay="0.1s"
              >
                <h4 className="small-title">
                  our agile process<span className="square-dot-small"></span>
                </h4>
                <h3 className="title-desc spacing120">Adapting agility for smarter outcomes</h3>
                <p className="title-info mb-0">
                  At Pi Techniques, we’ve learned that agility isn’t just a methodology, it’s a mindset. As client needs
                  evolve, we adapt. That’s why we’ve embraced{" "}
                  <span className="text-orange">Agile Project Management.</span> A proven, flexible framework that helps
                  us stay aligned, responsive, and focused on what matters most: delivering results, fast.
                </p>
              </div>
              <div className="col-12 col-md-12 offset-md-0 col-xl-4 col-xxl-5 offset-xl-1">
                <div className="our-process">
                  <div className=" wow " data-wow-delay="0.1s">
                    <h4 className="mb-0">Discover & Define</h4>
                    <p className="service-info">
                      We start by understanding your goals, challenges, and vision — laying the foundation with clear
                      scope and priorities.
                    </p>
                  </div>
                  <div className=" wow " data-wow-delay="0.3s">
                    <h4 className="mb-0">Plan & Prioritize</h4>
                    <p className="service-info">
                      {" "}
                      With a product backlog in place, we break down work into sprints — short, focused cycles that help
                      us move fast and stay focused.
                    </p>
                  </div>
                  <div className=" wow " data-wow-delay="0.5s">
                    <h4 className="mb-0">Design & Develop</h4>
                    <p className="service-info">
                      Our teams build iteratively, sharing progress frequently and refining the solution at every stage.
                    </p>
                  </div>
                  <div className=" wow " data-wow-delay="0.7s">
                    <h4 className="mb-0">Review & Collaborate</h4>
                    <p className="service-info">
                      At the end of each sprint, we present working features, gather feedback, and make sure we’re always
                      aligned.
                    </p>
                  </div>
                  <div className=" wow " data-wow-delay="0.8s">
                    <h4 className="mb-0">Test & Enhance</h4>
                    <p className="service-info">
                      {" "}
                      Continuous testing and integration ensures high quality products. We don’t just fix bugs — we
                      improve with each cycle.
                    </p>
                  </div>
                  <div className=" wow " data-wow-delay="0.8s">
                    <h4 className="mb-0">Deliver & Support</h4>
                    <p className="service-info">
                      Once we go live, we’re still with you — providing support, enhancements, and a roadmap for what’s
                      next.
                    </p>
                  </div>
                  <h6 className="our-process-italicTitle">
                    Agile isn’t about moving fast blindly. It’s about moving fast in the right direction — with you at
                    the center of the journey.{" "}
                  </h6>
                </div>
              </div>
              <div className="col-0 col-md-1"></div>
            </div>
          </div>
        </section>

        <section className="common-space160 bg-black team-members-ui">
          <div className="container-fluid p-0">
            <div className="row wow fadeInUp" data-wow-delay="0.1s">
              <div className="col-12 col-lg-11 col-xl-9 offset-xl-2 col-xxl-9 offset-xxl-2">
                <h4 className="small-title">
                  OUR TEAM <span className="square-dot-small"></span>
                </h4>
                <h3 className="title-desc">Leaders fuelled by passion</h3>
              </div>
            </div>

            <div className="row team p-0">
              <div className="col-12 col-lg-11 col-xl-9 offset-xl-2 col-xxl-9 offset-xxl-2">
                <div className="row team pb-0">
                  {leaders.map((m) => (
                    <TeamCard key={m.name} m={m} />
                  ))}
                  <a href="" className="modal-anchor" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    Test
                  </a>
                </div>
              </div>
            </div>

            <div className="row wow fadeInUp executiveteam" data-wow-delay="0.1s">
              <div className="col-12 col-lg-11 col-xl-9 offset-xl-2 col-xxl-9 offset-xxl-2">
                <h3 className="title-desc">Executive Team</h3>
              </div>
            </div>
            <div className="row team p-0">
              <div className="col-12 col-lg-11 col-xl-9 offset-xl-2 col-xxl-9 offset-xxl-2">
                <div className="row team pb-0">
                  {executives.map((m) => (
                    <TeamCard key={m.name} m={m} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModal" aria-hidden="true">
        <div className="modal-dialog modal-new">
          <div className="modal-content">
            <div className="modal-body">
              <button type="button" className="modal-close-ui" data-bs-dismiss="modal" aria-label="Close">
                <img src="/images/Popup1.jpg" alt="" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <PageScripts extra={["/js/about-p5.js", "/js/about.js"]} />
    </>
  );
}
