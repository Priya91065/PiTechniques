/* eslint-disable @next/next/no-img-element */
import type { JSX } from "react";
import type { PublicSection } from "@/server/content/pages";
import type {
  CardsContent,
  CollectionRefContent,
  ContactFormContent,
  CtaContent,
  CustomHtmlContent,
  FaqContent,
  HeroContent,
  ImageContent,
  ImageTextContent,
  RichTextContent,
  StatisticsContent,
  TeamContent,
  TimelineContent,
} from "@/lib/validation/section";
import { getServices, type PublicService } from "@/server/content/services";
import { getTestimonials, type PublicTestimonial } from "@/server/content/testimonials";
import { getTeamGroups, type PublicTeamMember } from "@/server/content/team";
import { getClients, type PublicClient } from "@/server/content/clients";
import { getFaqs, type PublicFaq } from "@/server/content/faqs";

/** Split a block of text into paragraphs on blank lines (faithful to the site copy style). */
function paragraphs(text: string): string[] {
  return text.split(/\n{2,}/).map((p) => p.trim()).filter((p) => p.length > 0);
}

/** Eyebrow + heading header used by most blocks (faithful small-title / title-desc markup). */
function SectionHeader({ eyebrow, heading }: { eyebrow?: string; heading?: string }): JSX.Element | null {
  if (!eyebrow && !heading) return null;
  return (
    <div className="row">
      <div className="col-12 col-xl-9 offset-xl-2">
        {eyebrow ? (
          <h4 className="small-title">
            {eyebrow}
            <span className="square-dot-small"></span>
          </h4>
        ) : null}
        {heading ? <h3 className="title-desc pb-4">{heading}</h3> : null}
      </div>
    </div>
  );
}

// ---- Content blocks -----------------------------------------------------------

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
              <p key={i} className="text-white1">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ImageText({ c }: { c: ImageTextContent }): JSX.Element {
  const imageFirst = c.imagePosition === "left";
  const image = (
    <div className="col-12 col-xl-4">
      <img src={c.image} alt={c.imageAlt ?? ""} className="img-fluid w-100" style={{ borderRadius: 12 }} />
    </div>
  );
  const text = (
    <div className="col-12 col-xl-5">
      {c.heading ? <h3 className="title-desc mb-4">{c.heading}</h3> : null}
      {paragraphs(c.body).map((p, i) => (
        <p key={i} className="text-white1">
          {p}
        </p>
      ))}
    </div>
  );
  return (
    <section className="who-we-are bg-black common-space140">
      <div className="container p-0">
        <div className="row g-4 align-items-center justify-content-center">
          <div className="col-xl-2 d-none d-xl-block"></div>
          {imageFirst ? image : text}
          {imageFirst ? text : image}
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
              <p className="text-center text-white1 mt-3 mb-0" style={{ opacity: 0.7 }}>
                {c.caption}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

const cardBoxStyle = { border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: 24, height: "100%" } as const;

function Cards({ c }: { c: CardsContent }): JSX.Element {
  const xl = { 2: 6, 3: 4, 4: 3 }[c.columns ?? 3] ?? 4;
  return (
    <section className="who-we-are bg-black common-space140">
      <div className="container p-0">
        <SectionHeader eyebrow={c.eyebrow} heading={c.heading} />
        <div className="row g-4">
          {c.items.map((card, i) => (
            <div key={i} className={`col-12 col-md-6 col-xl-${xl}`}>
              <div style={cardBoxStyle}>
                {card.icon ? <img src={card.icon} alt="" style={{ height: 56, width: "auto", marginBottom: 16 }} /> : null}
                <h4 className="text-white1 mb-3">{card.title}</h4>
                {card.description ? <p className="text-white1 mb-2">{card.description}</p> : null}
                {card.linkHref && card.linkLabel ? (
                  <a href={card.linkHref} className="btnWithRightArrow">
                    {card.linkLabel}
                    <span className="arrowbg">
                      <img src="/images/newRightArrow.svg" className="rightArrow" alt="Right Arrow" />
                    </span>
                  </a>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Statistics({ c }: { c: StatisticsContent }): JSX.Element {
  return (
    <section className="who-we-are bg-black common-space140">
      <div className="container p-0">
        <SectionHeader eyebrow={c.eyebrow} heading={c.heading} />
        <div className="row g-4 text-center justify-content-center">
          {c.items.map((s, i) => (
            <div key={i} className="col-6 col-md-4 col-xl-3">
              <div className="text-white1" style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.1 }}>
                {s.value}
                <span style={{ color: "#ff5f00" }}>{s.suffix}</span>
              </div>
              <p className="text-white1 mb-0 mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Timeline({ c }: { c: TimelineContent }): JSX.Element {
  return (
    <section className="who-we-are bg-black common-space140">
      <div className="container p-0">
        <SectionHeader eyebrow={c.eyebrow} heading={c.heading} />
        <div className="row">
          <div className="col-12 col-xl-9 offset-xl-2">
            {c.items.map((item, i) => (
              <div key={i} style={{ borderLeft: "2px solid #ff5f00", paddingLeft: 24, paddingBottom: i < c.items.length - 1 ? 32 : 0 }}>
                <h4 className="small-title mb-1">{item.year}</h4>
                <h4 className="text-white1 mb-2">{item.title}</h4>
                {item.description ? <p className="text-white1 mb-0">{item.description}</p> : null}
              </div>
            ))}
          </div>
        </div>
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

/** Faithful contact form markup — /js/contact.js posts it to /api/contact. */
function ContactFormBlock({ c }: { c: ContactFormContent }): JSX.Element {
  return (
    <section className="common-space140 bg-black" id="getintouch">
      <div className="container-fluid p-0">
        <div className="row">
          <div className="col-12 col-xl-2 offset-xl-2">
            {c.eyebrow ? (
              <h4 className="small-title">
                {c.eyebrow}
                <span className="square-dot-small"></span>
              </h4>
            ) : null}
            {c.heading ? <h3 className="title-desc">{c.heading}</h3> : null}
          </div>
          <div className="col-12 col-xl-6 offset-xl-1">
            {c.intro ? <p className="service-name mt-0">{c.intro}</p> : null}
            <form action="#" method="post" className="custom-input" id="contact-form" encType="multipart/form-data">
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
  );
}

function CustomHtml({ c }: { c: CustomHtmlContent }): JSX.Element {
  return (
    <section className="who-we-are bg-black common-space140">
      <div className="container p-0">
        <div className="row">
          <div className="col-12 col-xl-9 offset-xl-2" dangerouslySetInnerHTML={{ __html: c.html }} />
        </div>
      </div>
    </section>
  );
}

// ---- Global module sections (data fetched from the shared collections) --------

function ServicesGrid({ c, services }: { c: CollectionRefContent; services: PublicService[] }): JSX.Element {
  const items = c.limit ? services.slice(0, c.limit) : services;
  return (
    <section className="who-we-are bg-black common-space140">
      <div className="container p-0">
        <SectionHeader eyebrow={c.eyebrow} heading={c.heading} />
        <div className="row g-4">
          {items.map((s) => (
            <div key={s.id} className="col-12 col-md-6 col-xl-4">
              <div style={cardBoxStyle}>
                <img src={s.iconLight} alt="" style={{ height: 64, width: "auto", marginBottom: 16 }} />
                <h4 className="text-white1 mb-3">{s.title}</h4>
                <p className="text-white1 mb-3">{s.description}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {s.tags.map((t, i) => (
                    <span key={i} className="text-white1" style={{ border: "1px solid rgba(255,255,255,0.3)", borderRadius: 999, padding: "4px 12px", fontSize: 13 }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsGrid({ c, testimonials }: { c: CollectionRefContent; testimonials: PublicTestimonial[] }): JSX.Element {
  const items = c.limit ? testimonials.slice(0, c.limit) : testimonials;
  return (
    <section className="who-we-are bg-black common-space140">
      <div className="container p-0">
        <SectionHeader eyebrow={c.eyebrow} heading={c.heading} />
        <div className="row g-4">
          {items.map((t) => (
            <div key={t.id} className="col-12 col-xl-6">
              <div style={cardBoxStyle}>
                <p className="text-white1" style={{ fontStyle: "italic" }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="text-white1 mb-0" style={{ fontWeight: 700 }}>
                  {t.authorName}
                </p>
                <p className="text-white1 mb-0" style={{ opacity: 0.7 }}>
                  {t.designation}, {t.company}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamGrid({ c, members }: { c: TeamContent; members: PublicTeamMember[] }): JSX.Element {
  const items = c.limit ? members.slice(0, c.limit) : members;
  return (
    <section className="who-we-are bg-black common-space140">
      <div className="container p-0">
        <SectionHeader eyebrow={c.eyebrow} heading={c.heading} />
        <div className="row g-4">
          {items.map((m, i) => {
            const img = "img" in m && m.img ? m.img : "imgDesktop" in m ? m.imgDesktop : "";
            return (
              <div key={i} className="col-6 col-md-4 col-xl-3">
                {img ? <img src={img} alt={m.name} className="img-fluid w-100" style={{ borderRadius: 12, marginBottom: 12 }} /> : null}
                <h4 className="text-white1 mb-1">{m.name}</h4>
                <p className="text-white1 mb-0" style={{ opacity: 0.7 }}>
                  {m.role}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ClientsGrid({ c, clients }: { c: CollectionRefContent; clients: PublicClient[] }): JSX.Element {
  const items = c.limit ? clients.slice(0, c.limit) : clients;
  return (
    <section className="who-we-are bg-black common-space140">
      <div className="container p-0">
        <SectionHeader eyebrow={c.eyebrow} heading={c.heading} />
        <div className="row">
          <div className="col-12 col-xl-9 offset-xl-2">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
              {items.map((cl) => (
                <div key={cl.id} style={{ background: "#fff", borderRadius: 10, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img src={cl.logo} alt={cl.name} title={cl.name} style={{ height: 48, width: "auto", maxWidth: 180, objectFit: "contain" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqList({ c, faqs }: { c: FaqContent; faqs: PublicFaq[] }): JSX.Element {
  const items = c.limit ? faqs.slice(0, c.limit) : faqs;
  return (
    <section className="who-we-are bg-black common-space140">
      <div className="container p-0">
        <SectionHeader eyebrow={c.eyebrow} heading={c.heading} />
        <div className="row">
          <div className="col-12 col-xl-9 offset-xl-2">
            {items.map((f) => (
              <details key={f.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.15)", padding: "16px 0" }}>
                <summary className="text-white1" style={{ cursor: "pointer", fontWeight: 600, fontSize: 20 }}>
                  {f.question}
                </summary>
                <p className="text-white1 mt-3 mb-0">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---- Dispatcher ----------------------------------------------------------------

interface GlobalData {
  services: PublicService[];
  testimonials: PublicTestimonial[];
  team: { leaders: PublicTeamMember[]; executives: PublicTeamMember[] };
  clients: PublicClient[];
  /** Keyed by section id (each FAQ section can filter a different category). */
  faqsBySection: Map<string, PublicFaq[]>;
}

function renderSection(section: PublicSection, data: GlobalData): JSX.Element | null {
  switch (section.type) {
    case "hero":
      return <Hero c={section.content as HeroContent} />;
    case "richText":
      return <RichText c={section.content as RichTextContent} />;
    case "imageText":
      return <ImageText c={section.content as ImageTextContent} />;
    case "image":
      return <ImageBlock c={section.content as ImageContent} />;
    case "cards":
      return <Cards c={section.content as CardsContent} />;
    case "statistics":
      return <Statistics c={section.content as StatisticsContent} />;
    case "timeline":
      return <Timeline c={section.content as TimelineContent} />;
    case "cta":
      return <Cta c={section.content as CtaContent} />;
    case "contactForm":
      return <ContactFormBlock c={section.content as ContactFormContent} />;
    case "customHtml":
      return <CustomHtml c={section.content as CustomHtmlContent} />;
    case "services":
      return <ServicesGrid c={section.content as CollectionRefContent} services={data.services} />;
    case "testimonials":
      return <TestimonialsGrid c={section.content as CollectionRefContent} testimonials={data.testimonials} />;
    case "team": {
      const c = section.content as TeamContent;
      const group = c.group ?? "all";
      const members =
        group === "leadership" ? data.team.leaders : group === "executive" ? data.team.executives : [...data.team.leaders, ...data.team.executives];
      return <TeamGrid c={c} members={members} />;
    }
    case "clients":
      return <ClientsGrid c={section.content as CollectionRefContent} clients={data.clients} />;
    case "faq":
      return <FaqList c={section.content as FaqContent} faqs={data.faqsBySection.get(section.id) ?? []} />;
    default:
      return null;
  }
}

/**
 * Renders an ordered list of CMS page sections. Server component: sections that
 * reference global modules fetch live data from those collections here.
 */
export default async function CmsSections({ sections }: { sections: PublicSection[] }): Promise<JSX.Element> {
  const types = new Set(sections.map((s) => s.type));

  const faqSections = sections.filter((s) => s.type === "faq");
  const [services, testimonials, team, clients, faqLists] = await Promise.all([
    types.has("services") ? getServices() : Promise.resolve<PublicService[]>([]),
    types.has("testimonials") ? getTestimonials() : Promise.resolve<PublicTestimonial[]>([]),
    types.has("team") ? getTeamGroups() : Promise.resolve({ leaders: [] as PublicTeamMember[], executives: [] as PublicTeamMember[] }),
    types.has("clients") ? getClients() : Promise.resolve<PublicClient[]>([]),
    Promise.all(faqSections.map((s) => getFaqs((s.content as FaqContent).category || undefined))),
  ]);

  const data: GlobalData = {
    services,
    testimonials,
    team,
    clients,
    faqsBySection: new Map(faqSections.map((s, i) => [s.id, faqLists[i] ?? []])),
  };

  return (
    <>
      {sections.map((s) => (
        <div key={s.id}>{renderSection(s, data)}</div>
      ))}
    </>
  );
}
