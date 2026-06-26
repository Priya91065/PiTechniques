/* eslint-disable @next/next/no-img-element, react/no-unescaped-entities */
import type { JSX } from "react";
import type { Metadata } from "next";
import BodyClass from "@/components/home/BodyClass";
import PageScripts from "@/components/home/PageScripts";
import { buildMetadata } from "@/lib/seo/metadata";
import { getPublishedContactPage } from "@/server/content/contactPage";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/contact-us", { title: "Contact Us" });
}

export default async function ContactPage(): Promise<JSX.Element> {
  const content = await getPublishedContactPage();
  const MAP_EMBED = content.mapEmbedUrl;
  const MAP_DIRECTIONS = content.directionsUrl;

  return (
    <>
      <BodyClass name="contact-page" />
      <link rel="stylesheet" href="/css/contact.css" precedence="pi-original" />

      <section className="common-space140 topHeaderSpace contact-wrapper grey-section">
        <div className="offset-xl-2">
          <h4 className="small-title ">
            {content.locationHeading}
            <span className="square-dot-small"></span>
          </h4>
          <h3 className="title-desc pb-5">{content.locationTitle}</h3>
        </div>
        <div className="row mt-0 g-0 mt-md-5 flex-column-reverse flex-lg-row">
          <div className="col-12 col-md-12 col-lg-7 col-xl-5 col-xxl-5 offset-xl-2 g-0">
            <div className="office-box">
              <div className="iFrame-contact">
                <iframe
                  src={MAP_EMBED}
                  width="600"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <div className="card-footer">
                <div>
                  <p className="ofc-name">{content.officeName}</p>
                  <p className="ofc-location">{content.officeCity}</p>
                </div>
                <div className="direction direction-new">
                  <a href={MAP_DIRECTIONS} target="_blank" rel="noreferrer">
                    <span>Get directions</span>
                    <button type="button" className="btn btnWithRightArrow ">
                      <img src="/images/newRightArrow.svg" className="rightArrow" alt="Right Arrow" />
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12 col-lg-4 col-xl-4 g-0">
            <div className="">
              <p className="office-address mb-0">
                {content.officeAddress.map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < content.officeAddress.length - 1 && <br />}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
      </section>

      {content.officeLocations.map((office, i) => (
        <section key={i} className="common-space140 topHeaderSpace contact-wrapper grey-section">
          <div className="row mt-0 g-0 mt-md-5 flex-column-reverse flex-lg-row">
            <div className="col-12 col-md-12 col-lg-7 col-xl-5 col-xxl-5 offset-xl-2 g-0">
              <div className="office-box">
                <div className="card-footer">
                  <div>
                    <p className="ofc-name">{office.name}</p>
                  </div>
                  {office.mapUrl && (
                    <div className="direction direction-new">
                      <a href={office.mapUrl} target="_blank" rel="noreferrer">
                        <span>Get directions</span>
                        <button type="button" className="btn btnWithRightArrow ">
                          <img src="/images/newRightArrow.svg" className="rightArrow" alt="Right Arrow" />
                        </button>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-md-12 col-lg-4 col-xl-4 g-0">
              <div className="">
                <p className="office-address mb-0">
                  {office.addressLines.map((line, j) => (
                    <span key={j}>
                      {line}
                      {j < office.addressLines.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="common-space140 bg-black" id="getintouch">
        <div className="container-fluid p-0">
          <div className="row">
            <div className="col-12 col-xl-2 offset-xl-2 wow fadeInLeft " data-wow-duration="1s" data-wow-delay="0.3s">
              <h4 className="small-title ">
                {content.formHeading}
                <span className="square-dot-small"></span>
              </h4>
              <h3 className="title-desc">
                {content.formTitle}
              </h3>
            </div>
            <div className="col-12 col-xl-6 offset-xl-1">
              <p className="service-name wow fadeInRight mt-0" data-wow-duration="1s" data-wow-delay="0.3s">
                {content.formIntro}
              </p>
              <form action="#" method="post" className="custom-input wow fadeInRight" data-wow-delay="0.3s" id="contact-form" encType="multipart/form-data">
                <div className="form-group">
                  <label className="form-label">
                    First Name <span className="text-orange">*</span>
                    <input type="text" id="name" name="name" className="form-control" suppressHydrationWarning autoComplete="off" />
                  </label>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Last Name <span className="text-orange">*</span>
                    <input type="text" id="lname" name="lname" className="form-control" suppressHydrationWarning autoComplete="off" />
                  </label>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Email <span className="text-orange">*</span>
                    <input type="email" id="email" name="email" className="form-control" suppressHydrationWarning autoComplete="off" />
                  </label>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Contact Number <span className="text-orange">*</span>
                    <input type="text" id="phone" name="phone" className="form-control" suppressHydrationWarning maxLength={10} autoComplete="off" />
                  </label>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Message
                    <textarea id="message" name="message" className="form-control" suppressHydrationWarning autoComplete="off"></textarea>
                  </label>
                </div>
                <button type="button" id="applybtn" className="btn btnWithRightArrow btnWithRightArrow1" suppressHydrationWarning>
                  <span>Send request</span>{" "}
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
            <div className="col-xl-1"></div>
          </div>
        </div>
      </section>

      <PageScripts extra={["/js/contact.js"]} />
    </>
  );
}
