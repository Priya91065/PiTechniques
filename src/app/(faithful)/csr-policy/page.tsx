/* eslint-disable @next/next/no-img-element, react/no-unescaped-entities */
import type { JSX } from "react";
import type { Metadata } from "next";
import StaticPage from "@/components/home/StaticPage";

export const metadata: Metadata = { title: "CSR Policy" };

const CSR_STYLE = `
.csr-div .csr-logo img.logofilter{ mix-blend-mode: luminosity; }
.csr-div .csr-logo img.logofilter2{ height: auto; filter: grayscale(1); }`;

export default function CsrPolicyPage(): JSX.Element {
  return (
    <StaticPage pageClass="csr-policy" heading="CSR Policy" contentClassName="static-content csr-div">
      <style>{CSR_STYLE}</style>
      <div className="content-divide">
        <p>
          At Pi Techniques, we see CSR as a natural extension of who we are, not just a box that has to be checked.{" "}
        </p>
        <p>
          Whenever we support a cause, whether it’s helping children access better education, contributing to community
          initiatives, promoting health and well-being, or caring for animals it comes from a genuine place.{" "}
        </p>
        <p>
          We believe that small, consistent efforts can create real impact, and we prefer to stay hands-on and involved
          rather than doing things for visibility. Our approach is straightforward: support causes we truly care about,
          contribute where we can make a difference, and stay connected to the people and communities around us.
        </p>
      </div>
      <div className="content-divide">
        <div className="csr-logo align-items-center">
          <img src="/images/csr/teach-india-new.svg" className="logofilter" alt="Teach India" />
          <img src="/images/csr/manali.svg" alt="Manali Strays" />
          <img src="/images/csr/koshish.svg" alt="Koshish" />
          <img src="/images/csr/shraddha-new.jpg" className="logofilter2" alt="Shraddha" />
        </div>
        <div className="pdf-content">
          <a href="/pdf/CSR-policy.pdf" className="" target="_blank" rel="noreferrer">
            <img src="/pdf/pdf-thumbnail.png" className="pdf-image" alt="pdf-thumbnail" />
            <span>
              View document
              <span className="arrowbg">
                <img src="/images/newRightArrow.svg" className="rightArrow" alt="Right Arrow" />
              </span>
            </span>
          </a>
        </div>
      </div>
    </StaticPage>
  );
}
