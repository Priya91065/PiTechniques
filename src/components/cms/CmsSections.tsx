/* eslint-disable @next/next/no-img-element */
import type { JSX } from "react";
import type { PublicSection } from "@/server/content/pages";
import type { CtaContent, HeroContent, ImageContent, RichTextContent } from "@/lib/validation/section";

/** Split a block of text into paragraphs on blank lines (faithful to the site copy style). */
function paragraphs(text: string): string[] {
  return text.split(/\n{2,}/).map((p) => p.trim()).filter((p) => p.length > 0);
}

function Hero({ c }: { c: HeroContent }): JSX.Element {
  return (
    <section className="who-we-are bg-black topSpacing140 bottomSpacing140" style={c.backgroundImage ? { backgroundImage: `url(${c.backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}>
      <div className="container p-0">
        <div className="row">
          <div className="col-12 col-xl-9 offset-xl-2">
            <h3 className="title-desc">
              {c.heading}
              <span className="square-dot-medium"></span>
            </h3>
            {c.subheading ? <p className="banner-subtitle">{c.subheading}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function RichText({ c }: { c: RichTextContent }): JSX.Element {
  return (
    <section className="who-we-are bg-black common-space140">
      <div className="container p-0">
        <div className="row">
          <div className="col-12 col-xl-9 offset-xl-2">
            {c.heading ? <h3 className="title-desc mb-4">{c.heading}</h3> : null}
            {paragraphs(c.body).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ImageBlock({ c }: { c: ImageContent }): JSX.Element {
  const gallery = c.images.length > 1;
  return (
    <section className="who-we-are bg-black common-space140">
      <div className="container p-0">
        <div className="row g-3 justify-content-center">
          {c.images.map((img, i) => (
            <div key={i} className={gallery ? "col-12 col-md-6 col-lg-4" : "col-12 col-xl-9 offset-xl-2"}>
              <img src={img.url} alt={img.alt ?? ""} className="img-fluid w-100" style={{ borderRadius: 12 }} />
            </div>
          ))}
        </div>
        {c.caption ? (
          <div className="row">
            <div className="col-12 col-xl-9 offset-xl-2">
              <p className="text-center mt-3 mb-0" style={{ opacity: 0.7 }}>
                {c.caption}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Cta({ c }: { c: CtaContent }): JSX.Element {
  return (
    <section className="section3 position-relative bg-black common-space140">
      <div className="banner-text">
        <div>
          {c.heading ? <h2 className="mt-0 section-title">{c.heading}</h2> : null}
          {c.text ? <p className="text-white1">{c.text}</p> : null}
          <a href={c.buttonHref} className="btn-get btnWithRightArrow">
            {c.buttonLabel}
            <span className="arrowbg">
              <img src="/images/newRightArrow.svg" className="rightArrow" alt="Right Arrow" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

function renderSection(section: PublicSection): JSX.Element | null {
  switch (section.type) {
    case "hero":
      return <Hero c={section.content as HeroContent} />;
    case "richText":
      return <RichText c={section.content as RichTextContent} />;
    case "image":
      return <ImageBlock c={section.content as ImageContent} />;
    case "cta":
      return <Cta c={section.content as CtaContent} />;
    default:
      return null;
  }
}

/** Renders an ordered list of CMS page sections. */
export default function CmsSections({ sections }: { sections: PublicSection[] }): JSX.Element {
  return (
    <>
      {sections.map((s) => (
        <div key={s.id}>{renderSection(s)}</div>
      ))}
    </>
  );
}
