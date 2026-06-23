/* eslint-disable @next/next/no-img-element, react/no-unescaped-entities */
import { Fragment, type JSX } from "react";
import type { Metadata } from "next";
import OriginalHead from "@/components/home/OriginalHead";
import BodyClass from "@/components/home/BodyClass";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import Loader from "@/components/home/Loader";
import ClientLogos from "@/components/home/ClientLogos";
import Scripts from "@/components/home/Scripts";
import { getTestimonials } from "@/server/content/testimonials";
import { getServices } from "@/server/content/services";
import { getCaseStudyCards } from "@/server/content/caseStudies";
import { getBanner, getHomeStats } from "@/server/content/banner";
import { getAbout } from "@/server/content/about";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/", { title: "Homepage" });
}

/**
 * Faithful port of index.php (+ header.php / footer.php / loader.php /
 * clients-logos.php). Markup and class names are preserved exactly so the
 * original stylesheets and scripts reproduce the production homepage 1:1.
 */
export default async function Page(): Promise<JSX.Element> {
  const [testimonials, services, caseStudyCards, banner, stats, about] = await Promise.all([
    getTestimonials(),
    getServices(),
    getCaseStudyCards(),
    getBanner(),
    getHomeStats(),
    getAbout(),
  ]);
  const heroLines = banner.heroTitle.split("\n");
  return (
    <>
      <OriginalHead />
      <BodyClass name="homepage" />

      <Header />

      <div className="loader" data-js-el="loader"></div>

      <Loader />

      <div className="hidebody">
        {/* ===== Hero ===== */}
        {banner.showBanner && (
          <section
            className="animatio-option2 header-animation-section top-section pe-0 bg-black animation-section"
            style={
              banner.bannerImage
                ? { backgroundImage: `url(${banner.bannerImage})`, backgroundSize: "cover", backgroundPosition: "center" }
                : undefined
            }
          >
            <div className="container-fluid p-0 case-studies-ui" style={{ height: "100%" }} id="animate-section">
              <div className="d-flex align-items-center" style={{ height: "100%" }}>
                <div className="left-div wow fadeIn" data-wow-duration="1s" data-wow-delay="0.1s">
                  <h2>
                    {heroLines.map((line, i) => (
                      <Fragment key={i}>
                        {line}
                        {i < heroLines.length - 1 ? <br /> : null}
                      </Fragment>
                    ))}
                    <span className="square-dot"></span>
                  </h2>
                  <p className="banner-subtitle">{banner.heroSubtitle}</p>
                  <a
                    href={banner.heroCtaHref}
                    className="tclick btn-outline-secondary-new btn-outline-white homebanner-btn btnWithRightArrow btnWithRightArrow1"
                    data-wow-duration="1.5s"
                    {...(banner.heroCtaNewTab ? { target: "_blank", rel: "noreferrer" } : {})}
                  >
                    <span>{banner.heroCtaLabel}</span>
                    <span className="arrowbg">
                      <img src="/images/rightNewArrow1.svg" className="rightArrow" alt="Right Arrow" />
                    </span>
                  </a>
                </div>
                <div id="canvas-container"></div>
              </div>
            </div>
            {banner.showStats && (
              <div className="container-fluid p-0">
                <div className="row g-0">
                  <div className="col-12 col-xl-8 offset-xl-2 numberDataNewUI">
                    <div className="number-data-main">
                      <div className="numbers-data">
                        {stats.map((s, i) => (
                          <div className="total-number" key={i}>
                            <h3>
                              <span className="counter" data-target={s.value}>
                                {s.value}
                              </span>{" "}
                              <span className="text-orange">{s.suffix}</span>
                            </h3>
                            <p>{s.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ===== Mobile numbers ===== */}
        {banner.showStats && (
          <div className="mob-numbers-data">
            {stats.map((s, i) => (
              <div className="total-number" key={i}>
                <h3>
                  <span className="counter" data-target={s.value}>
                    0
                  </span>{" "}
                  <span className="text-orange">{s.suffix}</span>
                </h3>
                <p>{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* ===== Who we are ===== */}
        <section className="who-we-are common-space160 pb-0 grey-section">
          <div className="container-fluid p-0">
            <div className="row g-0">
              <div className="col-12 col-xl-8 offset-xl-2">
                <div className="row g-0">
                  <div className="col-12 col-xl-12 wow fadeInLeft" data-wow-duration="2s">
                    <div className="section-name">
                      <h4 className="small-title">
                        {about.whoEyebrow}
                        <span className="square-dot-small"> </span>
                      </h4>
                      <h3 className="title-desc">{about.whoTitle}</h3>
                    </div>
                  </div>
                  <div className="col-12 col-lg-7 col-xl-6 wow fadeInLeft" data-wow-duration="2s">
                    {about.whoParagraphs.map((p, i) => (
                      <p className="title-info" key={i}>
                        {p}
                      </p>
                    ))}
                    <a href={about.whoCtaHref} className="tclick btn-outline-secondary-new jobOpprtunitiesBtn btnWithRightArrow blackBtn">
                      <span>{about.whoCtaLabel}</span>
                      <span className="arrowbg">
                        <img src="/images/newRightArrow.svg" className="rightArrow" alt="Right Arrow" />
                      </span>
                    </a>
                  </div>
                  <div className="col-12 col-lg-5 col-xl-6 wow fadeInRight" data-wow-duration="2s">
                    <div className="newoffice1" style={about.aboutImage ? { backgroundImage: `url(${about.aboutImage})` } : undefined}></div>
                  </div>
                </div>
                <img src="/images/water-mark.png" className="w-100 bottomimg img-fluid" alt="32 Years" />
              </div>
            </div>
          </div>
        </section>

        {/* ===== Services ===== */}
        <section className="common-space160 bg-black services-sec">
          <div className="container-fluid p-0">
            <div className="row g-0 align-items-center">
              <div
                className="col-12 col-lg-7 col-xl-6 offset-xl-2 col-min-desk pr-20 wow fadeInUp"
                data-wow-duration="1.5s"
                data-wow-delay="0.1s"
              >
                <h4 className="small-title">
                  OUR SERVICES<span className="square-dot-small"> </span>
                </h4>
                <h3 className="title-desc mb64 text-container section-title">Strategy, design, and tech in action</h3>
              </div>
              <div className="col-12 col-lg-3 offset-lg-2 col-xl-2 offset-xl-0 col-min-desk pl-20">
                <a
                  href="/services"
                  className="tclick btn-outline-secondary-new btn-outline-white float-xl-end wow fadeInUp btnWithRightArrow"
                  data-wow-duration="1.5s"
                >
                  <span>View all</span>
                  <span className="arrowbg">
                    <img src="/images/newRightArrow.svg" className="rightArrow" alt="Right Arrow" />
                  </span>
                </a>
              </div>
            </div>
            <div className="all-services">
              <div className="row g-0">
                {services.map((s, i) => (
                  <div
                    key={s.id}
                    className={`col-12 col-lg-6 col-xl-4 col-min-desk ${
                      i % 2 === 0 ? "offset-xl-2 pr-20" : "pl-20"
                    }`}
                  >
                    <a href={`/services#${s.anchor}`} aria-label="services" className="removeUnderline">
                      <img src={s.iconDark} className="lotties" alt="" width={143} height={128} />
                      <h3 className="service-name service-name-new">{s.title}</h3>
                      <div className="d-flex flex-wrap gap-12">
                        {s.tags.map((t) => (
                          <span key={t} className="tag tag-new">
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="onHoverArrow">
                        <div className="ArrowUI">
                          <span className="arrowbg">
                            <img src="/images/newRightArrow.svg" className="rightArrow" alt="Right Arrow" />
                          </span>
                        </div>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== Our work ===== */}
        <section className="our-work our-work-new common-space160 pe-0 grey-section">
          <div className="container-fluid p-0">
            <div className="row g-0">
              <div className="col-xl-10 offset-xl-2">
                <div className="wow fadeInUp" data-wow-duration="1.5s">
                  <h4 className="small-title">
                    our work<span className="square-dot-small"></span>
                  </h4>
                  <h3 className="title-desc">Dive into our case studies</h3>
                </div>
                <div className="owl-carousel owl-theme work-carousel work-carousel-new">
                  {caseStudyCards.map((c) => (
                    <div className="item" key={c.slug}>
                      <div className="card-group">
                        <div className="card border-0">
                          <a href={`/detailed-project?project=${c.slug}`} className="div-clickable" aria-label="casestudies">
                            <img src={c.cardImage} className="card-img-top w-100 d-none d-md-block" alt={c.cardClient} />
                            <img src={c.cardImageMobile} className="card-img-top w-100 d-block d-md-none" alt={c.cardClient} />
                            <div className="card-footer">
                              <div className="our-work-div">
                                <p className="service-name">{c.title}</p>
                                <p className="service-info">{c.cardClient}</p>
                              </div>
                              <span className="Arrow_UI">
                                <img src="/images/newRightArrow.svg" className="rightArrow" alt="Right Arrow" />
                              </span>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div></div>
            </div>
            <div className="container"></div>
          </div>
        </section>

        {/* ===== Clients ===== */}
        <section className="common-space120 our-clients grey-section">
          <div className="container text-md-center wow fadeInUp" data-wow-duration="1.5s">
            <h4 className="small-title">
              OUR CLIENTS<span className="square-dot-small"></span>
            </h4>
            <h3 className="title-desc ">Lasting partnerships</h3>
          </div>
        </section>

        <ClientLogos />

        {/* ===== Testimonials ===== */}
        <section className="bg-black testimonials testimonials-home testimonials-swiperUI px-0 common-space160">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12 col-xl-10 offset-xl-2 wow fadeInUp" data-wow-duration="1.5s" style={{ position: "relative" }}>
                <h4 className="small-title">
                  TESTIMONIALS<span className="square-dot-small"></span>
                </h4>
                <h3 className="title-desc respTitleWidth">Voices of trust</h3>
                <div className="glide-parentUI">
                  <div className="glide">
                    <div data-glide-el="controls" className="next-prev-btn">
                      <button className="glide__arrow glide__arrow--prev" data-glide-dir="<">
                        <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11.2857 1L19 9M19 9L11.2857 17M19 9H1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                      </button>
                      <button className="glide__arrow glide__arrow--next" data-glide-dir=">">
                        <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11.2857 1L19 9M19 9L11.2857 17M19 9H1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                      </button>
                    </div>
                    <div className="glide__track" data-glide-el="track">
                      <ul className="glide__slides">
                        {testimonials.map((t) => (
                          <li className="glide__slide" key={t.id}>
                            <p>&quot;{t.quote}&quot;</p>
                            <div>
                              <h6>{t.company}</h6>
                              <small>
                                {t.authorName}, <i>{t.designation}</i>
                              </small>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />

      <Scripts />
    </>
  );
}
