/* eslint-disable @next/next/no-img-element, react/no-unescaped-entities */
import type { JSX } from "react";
import type { Metadata } from "next";
import BodyClass from "@/components/home/BodyClass";
import PageScripts from "@/components/home/PageScripts";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/contact-us", { title: "Contact Us" });
}

const MAP_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3774.140669523596!2d72.824424!3d18.9251667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7d1e97e031c0b%3A0x8a44b9ad6132d028!2sPi%20Techniques%20Pvt.%20Ltd.!5e0!3m2!1sen!2sin!4v1762169535718!5m2!1sen!2sin";

const MAP_DIRECTIONS =
  "https://www.google.com/maps/place/Pi+Techniques+Pvt.+Ltd./@18.9251667,72.824424,17z/data=!3m1!4b1!4m6!3m5!1s0x3be7d1e97e031c0b:0x8a44b9ad6132d028!8m2!3d18.9251667!4d72.824424!16s%2Fg%2F1th5y83b?entry=ttu";

export default function ContactPage(): JSX.Element {
  return (
    <>
      <BodyClass name="contact-page" />
      <link rel="stylesheet" href="/css/contact.css" precedence="pi-original" />

      <section className="common-space140 topHeaderSpace contact-wrapper grey-section">
        <div className="offset-xl-2">
          <h4 className="small-title ">
            LOCATION<span className="square-dot-small"></span>
          </h4>
          <h3 className="title-desc pb-5">Our headquarters</h3>
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
                  <p className="ofc-name">Nariman Point</p>
                  <p className="ofc-location">Mumbai</p>
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
                61/63C Mittal Tower, <br />
                Nariman Point, <br />
                Mumbai - 400021
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="common-space140 bg-black" id="getintouch">
        <div className="container-fluid p-0">
          <div className="row">
            <div className="col-12 col-xl-2 offset-xl-2 wow fadeInLeft " data-wow-duration="1s" data-wow-delay="0.3s">
              <h4 className="small-title ">
                Contact US<span className="square-dot-small"></span>
              </h4>
              <h3 className="title-desc">
                Get in<br className="d-none d-xl-block" />
                touch
              </h3>
            </div>
            <div className="col-12 col-xl-6 offset-xl-1">
              <p className="service-name wow fadeInRight mt-0" data-wow-duration="1s" data-wow-delay="0.3s">
                We're here to help and answer any questions you might have. We look forward to hearing from you.
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
