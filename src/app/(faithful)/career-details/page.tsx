/* eslint-disable @next/next/no-img-element, react/no-unescaped-entities */
import type { JSX, ReactNode } from "react";
import type { Metadata } from "next";
import BodyClass from "@/components/home/BodyClass";
import PageScripts from "@/components/home/PageScripts";
import { getJobBySlug, type Responsibilities as ResponsibilitiesData } from "@/server/content/jobs";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ jobTitle?: string }>;
}): Promise<Metadata> {
  const { jobTitle = "" } = await searchParams;
  const job = await getJobBySlug(jobTitle);
  if (!job) return { title: "Career Details" };
  return {
    title: job.seoTitle ?? `${job.title} | Careers`,
    description: job.seoDescription ?? job.shortDescription ?? `Apply for the ${job.title} role at Pi Techniques.`,
  };
}

function Bullet({ children }: { children: ReactNode }): JSX.Element {
  return (
    <li>
      <span>
        <span className="square-dot"></span>
      </span>
      {children}
    </li>
  );
}

function Responsibilities({ data }: { data: ResponsibilitiesData }): JSX.Element {
  if (Array.isArray(data)) {
    return (
      <>
        {data.map((task, i) => (
          <Bullet key={i}>{task}</Bullet>
        ))}
      </>
    );
  }
  return (
    <>
      {Object.entries(data).map(([category, tasks]) => (
        <div key={category}>
          <h4>{category}</h4>
          <ul>
            {tasks.map((task, i) => (
              <Bullet key={i}>{task}</Bullet>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

export default async function CareerDetailsPage({
  searchParams,
}: {
  searchParams: Promise<{ jobTitle?: string }>;
}): Promise<JSX.Element> {
  const { jobTitle = "" } = await searchParams;
  const job = await getJobBySlug(jobTitle);

  return (
    <>
      <BodyClass name="career-details-page" />
      <section className="who-we-are bg-black">
        <div className="container p-0">
          <div className="row justify-content-between">
            {job ? (
              <>
                <div className="col-12 col-lg-12 col-xl-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.3s">
                  <div className="career-topSection">
                    <a href="/careers#currentOpening" className="btn-get btnWithRightArrow onlyArrow backToList">
                      <span className="arrowbg">
                        <img src="/images/whiteright-new-arrow.svg" className="backArrow" alt="Back Arrow" />
                      </span>
                      <span className="d-block d-lg-none">Back</span>
                    </a>
                    <h3 className="title-desc">
                      {job.title}
                      <span className="square-dot-medium"></span>
                    </h3>
                  </div>
                </div>
                <div className="col-12 col-lg-12 col-xl-12 ">
                  <div className="accordion " id="jobaccordion">
                    <div className="accordion-item wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.3s">
                      <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                        <button className="accordion-button noHover" suppressHydrationWarning>
                          <h3 className="mb-0">Qualifications</h3>
                        </button>
                      </h2>
                      <div
                        id="panelsStayOpen-collapseOne"
                        className="accordion-collapse collapse show"
                        aria-labelledby="panelsStayOpen-headingOne"
                      >
                        <div className="accordion-body">
                          <div className="service-list m-0">
                            <ul className="ps-0 mb-0">
                              {job.qualifications.map((q, i) => (
                                <Bullet key={i}>{q}</Bullet>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {job.responsibilities && (
                      <div className="accordion-item wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.3s">
                        <h2 className="accordion-header" id="panelsStayOpen-headingTwo">
                          <button
                            className="accordion-button collapsed"
                            type="button"
                            suppressHydrationWarning
                            data-bs-toggle="collapse"
                            data-bs-target="#panelsStayOpen-collapseTwo"
                            aria-expanded="false"
                            aria-controls="panelsStayOpen-collapseTwo"
                          >
                            <h3 className="mb-0">Key Responsibilities</h3>
                            <div className="accordionArrow">
                              <img src="/images/upNewArrow.svg" alt="" className="img-fluid upArrow" />
                              <img src="/images/downNewArrow.svg" alt="" className="img-fluid downArrow" />
                            </div>
                          </button>
                        </h2>
                        <div
                          id="panelsStayOpen-collapseTwo"
                          className="accordion-collapse collapse"
                          aria-labelledby="panelsStayOpen-headingTwo"
                        >
                          <div className="accordion-body">
                            <div className="service-list m-0">
                              <ul className="ps-0 mb-0">
                                <Responsibilities data={job.responsibilities} />
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {job.skills && job.skills.length > 0 && (
                      <div className="accordion-item wow fadeInUp goodToHave" data-wow-duration="1s" data-wow-delay="0.3s">
                        <h2 className="accordion-header" id="panelsStayOpen-headingThree">
                          <button
                            className="accordion-button collapsed"
                            type="button"
                            suppressHydrationWarning
                            data-bs-toggle="collapse"
                            data-bs-target="#panelsStayOpen-collapseThree"
                            aria-expanded="false"
                            aria-controls="panelsStayOpen-collapseThree"
                          >
                            <h3 className="mb-0">Good to have</h3>
                            <div className="accordionArrow">
                              <img src="/images/upNewArrow.svg" alt="" className="img-fluid upArrow" />
                              <img src="/images/downNewArrow.svg" alt="" className="img-fluid downArrow" />
                            </div>
                          </button>
                        </h2>
                        <div
                          id="panelsStayOpen-collapseThree"
                          className="accordion-collapse collapse"
                          aria-labelledby="panelsStayOpen-headingThree"
                        >
                          <div className="accordion-body">
                            <div className="service-list m-0">
                              <ul className="ps-0 mb-0">
                                {job.skills.map((s, i) => (
                                  <Bullet key={i}>{s}</Bullet>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="applyBtnSrollto">
                      <a href="#careerForm" className="btn-get btnWithRightArrow btnWithRightArrow1">
                        Apply{" "}
                        <span className="arrowbg">
                          <img src="/images/rightNewArrow1.svg" className="rightArrow" alt="Right Arrow" />
                        </span>
                      </a>
                    </div>
                    <div className="dividerUI"></div>
                    <div className="accordion-item wow fadeInUp tellUsAccordion" data-wow-duration="1s" data-wow-delay="0.3s">
                      <h2 className="accordion-header" id="headingApply">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseApply"
                          aria-expanded="false"
                          aria-controls="collapseApply"
                        >
                          <h3 className="mb-0">Tell us more about you</h3>
                          <div className="accordionArrow">
                            <img src="/images/upNewArrow.svg" alt="" className="img-fluid upArrow" />
                            <img src="/images/downNewArrow.svg" alt="" className="img-fluid downArrow" />
                          </div>
                        </button>
                      </h2>
                      <div
                        id="collapseApply"
                        className="accordion-collapse collapse"
                        aria-labelledby="headingApply"
                        data-bs-parent="#applyAccordion"
                      >
                        <div className="accordion-body">
                          <div id="careerForm" className="carrerForm mt-0">
                            <form
                              action="sendMail.php"
                              method="post"
                              id="jobform"
                              className="custom-input wow fadeInRight"
                              data-wow-delay="0.3s"
                              encType="multipart/form-data"
                            >
                              <input type="hidden" value={jobTitle} name="position" />
                              <div className="form-group">
                                <label className="form-label">
                                  First Name <span className="text-orange">*</span>
                                  <input type="text" id="name" name="name" className="form-control" suppressHydrationWarning autoComplete="off" />
                                </label>
                              </div>
                              <div className="form-group ">
                                <label className="form-label">
                                  Last Name <span className="text-orange">*</span>
                                  <input type="text" id="lname" name="lname" className="form-control" suppressHydrationWarning autoComplete="off" />
                                </label>
                              </div>
                              <div className="form-group ">
                                <label className="form-label">
                                  Email <span className="text-orange">*</span>
                                  <input type="email" id="email" name="email" className="form-control" suppressHydrationWarning autoComplete="off" />
                                </label>
                              </div>
                              <div className="form-group ">
                                <label className="form-label">
                                  Contact Number <span className="text-orange">*</span>
                                  <input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    className="form-control" suppressHydrationWarning
                                    autoComplete="off"
                                    maxLength={10}
                                    pattern="[0-9]{10}"
                                  />
                                </label>
                              </div>
                              <div className="form-group">
                                <label className="form-label">
                                  Message
                                  <textarea id="message" name="message" className="form-control" suppressHydrationWarning autoComplete="off"></textarea>
                                </label>
                              </div>
                              <div className="files-wr ">
                                <div className="one-file" data-count-files="1">
                                  <label htmlFor="file-1">
                                    Click to upload your CV/Resume
                                    <br />
                                    <small className="uploadFile">
                                      Upload file in Word, PDF format (File size max. 100mb)
                                    </small>
                                  </label>
                                  <input name="file-1" id="file-1" style={{ display: "none" }} type="file" suppressHydrationWarning />
                                  <div className="fileinputlists"></div>
                                </div>
                              </div>
                              <input type="hidden" name="recaptcha_response" id="recaptchaResponse" />
                              <button type="button" id="applybtn" className="btn btnWithRightArrow btnWithRightArrow1" suppressHydrationWarning>
                                <span>Submit</span>
                                <div className="arrowbg">
                                  <img src="/images/rightNewArrow1.svg" className="rightArrow" alt="Right Arrow" />
                                </div>
                              </button>
                              <div className="alert mt-3 d-none alert-dismissible fade show" role="alert">
                                <span id="alertMessage"></span>
                                <button type="button" className="btn-close mt-0" data-bs-dismiss="alert" aria-label="Close" suppressHydrationWarning></button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: "flex" }}>
                  <a href="/careers#currentOpening" className="btn btn-outline-secondary btn-rounded backToList">
                    <img src="/images/arrow_right_alt-new.svg" className="transform-img" alt="Back to List" />
                    Back
                  </a>
                </div>
                <h2 className="jobNotFoundTitle">Job Not Found</h2>
                <p className="jobNotFoundSubTitle">The requested job does not exist.</p>
              </>
            )}
          </div>
        </div>
      </section>

      <PageScripts extra={["/js/career-details.js"]} />
    </>
  );
}
