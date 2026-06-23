/* eslint-disable @next/next/no-img-element, react/no-unescaped-entities */
import type { JSX } from "react";
import type { Metadata } from "next";
import BodyClass from "@/components/home/BodyClass";
import ClientLogos from "@/components/home/ClientLogos";
import PageScripts from "@/components/home/PageScripts";
import { getServices } from "@/server/content/services";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/services", { title: "Services" });
}

function ClientsServed(): JSX.Element {
  return (
    <div className="clientsServedUI">
      <div>
        <p className="clientsServed">clients served</p>
        <div className="clientsServedLogos">
          <img src="/images/service/Taj-logo.png" width="auto" height="32" alt="OUR CLIENTS" />
          <img src="/images/service/v-logo.png" width="auto" height="28" alt="OUR CLIENTS" />
          <img src="/images/service/chanakya-logo.png" width="auto" height="20" alt="OUR CLIENTS" />
          <img src="/images/service/Taj-logo.png" width="auto" height="32" alt="OUR CLIENTS" />
          <img src="/images/service/chanakya-logo.png" width="auto" height="20" alt="OUR CLIENTS" />
          <img src="/images/service/v-logo.png" width="auto" height="28" alt="OUR CLIENTS" />
        </div>
      </div>
      <div className="view-case-study">
        <div>
          <a href="#">view case study </a>
          <svg width="17" height="10" viewBox="0 0 17 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M11.4192 9.64286L10.472 8.76597L13.9042 5.67785L0.5 5.45238V4.46501H13.9042L10.472 1.37689L11.4192 0.5L16.5 5.07143L11.4192 9.64286Z"
              fill="#F4F4F4"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default async function ServicesPage(): Promise<JSX.Element> {
  const services = await getServices();

  return (
    <>
      <BodyClass name="service-page" />
      <style>{`@media only screen and (max-width:767px){ img.lotties{ height:142px !important; } }`}</style>

      <section className="animatio-option2 top-section pe-0 bg-black animation-section">
        <div className="container-fluid p-0 case-studies-ui" style={{ height: "100%" }} id="animate-section">
          <div className="d-flex align-items-center" style={{ height: "100%" }}>
            <div className="left-div wow fadeIn" data-wow-duration="1s" data-wow-delay="0.1s">
              <h2>
                First we listen, then, <br />
                we shape the solution<span className="square-dot"></span>
              </h2>
              <p className="banner-subtitle">We build for clarity and longevity, the wins follow.</p>
            </div>
            <div id="canvas-container"></div>
          </div>
        </div>
      </section>

      <section className="who-we-are topSpacing140 grey-section">
        <div className="container-fluid p-0">
          <div className="row justify-content-between g-0">
            <div className="col-12 col-lg-12 col-xl-11 offset-xl-1 col-xxl-9 offset-xxl-2">
              <div className="row justify-content-between g-0">
                <div className="col-12 col-xl-5 wow fadeInLeft" data-wow-duration="1.5s">
                  <h4 className="small-title">
                    SERVICES<span className="square-dot-small"></span>
                  </h4>
                  <h3 className="title-desc">
                    Web and <br className="d-none d-xl-block" /> App Services
                  </h3>
                </div>
                <div className="col-12 col-xl-7 wow fadeInRight pe-0" data-wow-duration="1.5s">
                  <p>
                    Every business has unique challenges. At Pi Techniques, we build technology that adapts to you.
                    Whether you’re an individual, a growing business, or a global enterprise, we partner with you to
                    create solutions that fit your world. From sleek websites to complex applications and agile
                    infrastructure, everything we build is designed to support your goals and grow with you.
                  </p>
                  <a href="/contact-us" className="tclick2 btn-get btnWithRightArrow blackBtn">
                    Connect with us
                    <span className="arrowbg">
                      <img src="/images/newRightArrow.svg" className="rightArrow" alt="Right Arrow" />
                    </span>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-12 col-xl-11 offset-xl-1 col-xxl-10 offset-xxl-2">
              <div className="row app-services-new">
                {services.map((s) => (
                  <div key={s.id} className="col-12 col-md-4 col-lg-3 col-xl-2 custom-col">
                    <a href={`#${s.anchor}`} className="lottie-card">
                      <div>
                        <img src={s.iconLight} className="" alt="" width={91} height={80} />
                      </div>
                      <h3>{s.title}</h3>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ClientLogos className="logo-slider mb-40 mt-0" />

      <section className="common-space140 bg-black topBottom60 serviesalltailories">
        <div className="container-fluid p-0">
          <div className="all-services all-services-newUI mt-0">
            {services.map((s) => (
              <div key={s.id} className="row mb-40 wow fadeInUp" data-wow-delay="0.2s" id={s.anchor}>
                <div className="col-12 col-md-12 col-lg-11 col-xl-8 col-xxl-7 offset-xl-2">
                  <div className="lottie-box">
                    <img src={s.iconDark} className="lotties" alt="" width="" height={152} />
                    <div>
                      <h3 className="service-name">{s.title}</h3>
                      {s.description.split("\n\n").map((p, i) => (
                        <p key={i} className="service-info">
                          {p}
                        </p>
                      ))}
                      <div className="d-flex flex-wrap gap-12">
                        {s.tags.map((t) => (
                          <span key={t} className="tag tag-new">
                            {t}
                          </span>
                        ))}
                      </div>
                      <ClientsServed />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PageScripts extra={["/js/services-p5.js", "/js/services.js"]} />
    </>
  );
}
