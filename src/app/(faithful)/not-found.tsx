import type { JSX } from "react";
import type { Metadata } from "next";
import BodyClass from "@/components/home/BodyClass";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound(): JSX.Element {
  return (
    <>
      <BodyClass name="notfound-page" />
      <section className="who-we-are bg-black" style={{ minHeight: "60vh", display: "flex", alignItems: "center" }}>
        <div className="container p-0">
          <div className="row">
            <div className="col-12 col-xl-9 offset-xl-2">
              <h3 className="title-desc">
                Page not found
                <span className="square-dot-medium"></span>
              </h3>
              <p className="banner-subtitle">The page you’re looking for doesn’t exist or has moved.</p>
              <a href="/" className="btn-get btnWithRightArrow">
                Back home
                <span className="arrowbg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/newRightArrow.svg" className="rightArrow" alt="Right Arrow" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
