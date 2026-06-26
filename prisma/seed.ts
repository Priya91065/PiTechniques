/**
 * Database seed — populates the CMS with the site's current content so the
 * frontend (Phase 6) has real data to read, and creates the first Super Admin.
 *
 * Run with:  npm run db:seed   (Prisma loads .env for this command)
 * Idempotent: safe to run multiple times.
 */
import { PrismaClient, Prisma, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { caseStudyProjects } from "../src/constants/caseStudyProjects";
import { leaders as TEAM_LEADERS, executives as TEAM_EXECUTIVES, type TeamMember as AboutTeamMember } from "../src/constants/aboutTeam";
import { faithfulJobs, type FaithfulJob } from "../src/constants/faithfulJobs";

const prisma = new PrismaClient();

/** Ensure an asset path is rooted at the public folder. */
const img = (p: string): string => (p.startsWith("/") ? p : `/${p}`);

// ---------------------------------------------------------------------------
// Services (homepage cards + services page)
// ---------------------------------------------------------------------------
const SERVICES = [
  {
    slug: "application_development",
    anchor: "application_development",
    title: "Tailored and templated apps that make an impact",
    iconDark: "/images/home-lottie/Tailored.png",
    iconLight: "/images/services-lottie/Tailored.png",
    description:
      "Our application development is focused on solving real business challenges. With a sharp eye for usability and a passion for performance, we build streamlined, scalable apps that move with your business—fast, smart, and future-ready.",
    tags: ["MERN", "MEAN", "Enterprise .NET + SQL", "Java Solutions", "AI & Automation", "Data & Messaging"],
  },
  {
    slug: "AIPowered",
    anchor: "AIPowered",
    title: "Harnessing generative AI for real-world impact",
    iconDark: "/images/home-lottie/Harnessing-black.png",
    iconLight: "/images/services-lottie/Harnessingwhite.png",
    description:
      "We design and build intelligent solutions powered by leading generative AI models—both open-source and enterprise-grade. From conversational chatbots that streamline customer interactions to agentic AI agents that automate complex workflows, our team turns the latest AI capabilities into practical business tools.\n\nWhether it’s enhancing customer experience, boosting operational efficiency, or enabling smarter decision-making, we make AI work for you.",
    tags: ["OpenAI (GPT Models)", "Ollama", "LangChain", "Llama 2", "RAG", "Hugging Face"],
  },
  {
    slug: "Strategic_intelligence",
    anchor: "Strategic_intelligence",
    title: "Strategic intelligence, real-time decisions",
    iconDark: "/images/home-lottie/Strategic-Integlligence.png",
    iconLight: "/images/services-lottie/Strategic-Integlligence.png",
    description:
      "Harness the power of advanced analytics to drive measurable business outcomes. Our BI solutions deliver precision, visibility, and control — giving leaders the confidence to act with speed and accuracy in an evolving market.",
    tags: ["ETL & Data Pipelines", "PowerBI", "SQLBI", "DevExpress", "Database Integration & API"],
  },
  {
    slug: "Sleek_interfaces",
    anchor: "Sleek_interfaces",
    title: "Sleek interfaces complimenting effortless journeys",
    iconDark: "/images/home-lottie/Sleek-Interface.png",
    iconLight: "/images/services-lottie/Sleek-Interface.png",
    description:
      "We craft intuitive digital experiences that don’t just look good—they feel right. Every pixel is placed with purpose, blending aesthetic brilliance with seamless functionality. Your application deserves design that’s as bold as your vision.",
    tags: ["Figma", "Axure"],
  },
  {
    slug: "mobile_innovation",
    anchor: "mobile_innovation",
    title: "Strategic mobile innovation built with precision",
    iconDark: "/images/home-lottie/Strartegic-Mobile.png",
    iconLight: "/images/services-lottie/Strartegic-Mobile.png",
    description:
      "We craft sleek, high-impact mobile apps that don’t just function—they flow. Built with cutting-edge tech and serious design chops, our iOS and Android apps are smooth, scalable, and ready to wow. Whether it's a bold startup or a big idea, we turn screens into seamless experiences.",
    tags: ["Native iOS", "Native Android", "Xamarin", "React Native", "App Store & Play Store Deployment"],
  },
  {
    slug: "web-experiences",
    anchor: "web-experiences",
    title: "Web experiences that click",
    iconDark: "/images/home-lottie/Webexperincesblack.png",
    iconLight: "/images/services-lottie/Web-experinces.png",
    description:
      "We don’t just build websites — we craft digital playgrounds that look stunning, work flawlessly, and convert effortlessly. Whether you're a startup or scaling up, our team blends design, tech, and strategy to deliver custom, high-performance web experiences that set you apart. Fully responsive, mobile-first, and built for tomorrow.",
    tags: ["Angular JS", "Next.js", "MVC", "HTML5 & CSS3", "Wordpress", "Woo Commerce", "SEO & Performance Optimization"],
  },
  {
    slug: "Infrastructure",
    anchor: "Infrastructure",
    title: "Infrastructure that scales, DevOps that delivers",
    iconDark: "/images/home-lottie/Infrastructure.png",
    iconLight: "/images/services-lottie/Infrastructure.png",
    description:
      "We build and manage cloud-native, resilient infrastructures designed for growth. Our DevOps approach automates the pipeline—from code to deployment—so your applications are delivered faster, safer, and smarter. With monitoring, security, and optimization baked in, we keep your systems running at peak performance while you focus on innovation.",
    tags: ["CI/CD Pipelines", "Docker & Kubernetes", "Containerization & Orchestration", "Networking", "Hardware", "Firewall", "Security", "Hosting"],
  },
  {
    slug: "creatingSeamlessWorkflows",
    anchor: "creatingSeamlessWorkflows",
    title: "Connecting systems, creating seamless workflows",
    iconDark: "/images/home-lottie/Connectingblack.png",
    iconLight: "/images/services-lottie/Connectingwhite.png",
    description:
      "Your applications work better when they work together. We unify them into an intelligent ecosystem that reduces friction, enhances collaboration, and helps your business move with greater speed and agility.",
    tags: ["Zoho", "Salesforce", "Shopify", "SAP"],
  },
];

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------
const TESTIMONIALS = [
  {
    company: "Metro Shoes",
    authorName: "Aashish Mashruwala",
    designation: "Business Head of Metro Shoes",
    quote:
      "Integration was always a challenge for us until Pi Techniques stepped in. They simplified our infrastructure, ensured smooth connectivity across systems, and gave us the reliability and scalability we needed. Their solutions have saved us both time and costs.",
  },
  {
    company: "Rabia Gupta Designs",
    authorName: "Rabia Gupta",
    designation: "Founder",
    quote:
      "As strategic branding consultants, the design and execution of websites for our clients are critical. Our design solutions are always a marriage between a signature brand language and a relevant UI UX. And in this mix - Pi Techniques always steps in with a near perfect understanding of the detailed execution we require, along with great support and domain knowledge.",
  },
  {
    company: "The Willingdon Sports Club",
    authorName: "Gururaj Joshi",
    designation: "Dy Manager EDP",
    quote:
      "Our members expect premium experiences both offline and online. Pi Techniques designed and developed a web platform that makes everything — from logins to payments — effortless. Their team balanced design, security, and ease of use seamlessly.",
  },
  {
    company: "The Nutcracker",
    authorName: "Annie Bafna",
    designation: "Founder",
    quote:
      "We wanted our website to reflect the warmth and uniqueness of our brand. Pi Techniques delivered exactly that. The site is elegant, easy to navigate, and truly captures who we are. Their team was creative, patient, and extremely supportive.",
  },
  {
    company: "Chanakya",
    authorName: "Anisha Shetty",
    designation: "Chief of Atelier",
    quote:
      "Pi Techniques has been a true partner in our digital transformation journey. Their ability to understand our complex requirements and translate them into simple, scalable solutions has been invaluable. They don’t just deliver technology — they help us think ahead.",
  },
  {
    company: "St. Jude India ChildCare Centres",
    authorName: "Anil Nair",
    designation: "CEO",
    quote:
      "Our website plays a crucial role in telling the stories of the cancer warriors and families we care for. With Pi Techniques leading our website redesign, we got not just a sleek design transformation but a meaningful enhancement in how we showcase our cause and its impact. They blended creativity with clarity, improving the user experience while staying true to our core values. We’re grateful for their support and expertise.",
  },
];

// ---------------------------------------------------------------------------
// Clients (logos)
// ---------------------------------------------------------------------------
const CLIENTS: { name: string; logo: string; width?: number; height?: number }[] = [
  { name: "Chanakya", logo: "chanakya.svg", width: 320, height: 80 },
  { name: "V-Group", logo: "v-group.svg", width: 90, height: 67 },
  { name: "World Resources Institute", logo: "wri.svg", height: 88 },
  { name: "SeaTec", logo: "sea-tec.svg", width: 152, height: 56 },
  { name: "Taj", logo: "taj.svg", width: 118, height: 104 },
  { name: "CitiusTech", logo: "citius.png" },
  { name: "Metro", logo: "metro.png" },
  { name: "BDL", logo: "bdl-logo.svg", width: 132, height: 117 },
  { name: "Oceanic", logo: "oceanic.svg", width: 225, height: 38 },
  { name: "Cotton World", logo: "cotton-world.svg", height: 61 },
  { name: "Willingdon", logo: "willington.svg", width: 66, height: 100 },
  { name: "The Nutcracker", logo: "nutcracker.svg", height: 87 },
  { name: "Crownvet", logo: "crownvet.png" },
  { name: "Westwind", logo: "westwind.png" },
  { name: "Honey Bees", logo: "honey-bees.svg", width: 128, height: 128 },
  { name: "Sohfit", logo: "sohfit.svg", width: 222, height: 60 },
  { name: "Little Pplams School", logo: "littlepplamsschool.svg" },
  { name: "ADND", logo: "adnd-logo.svg" },
  { name: "Kizazi", logo: "kizazi.svg" },
  { name: "Chorus", logo: "chorus-logo-black.svg" },
  { name: "Jade", logo: "JadeLogoNew.svg" },
  { name: "Rabia Gupta Designs", logo: "rgd-logo.svg" },
  { name: "Zaka", logo: "zaka-logo.svg" },
  { name: "Amaya", logo: "amaya.svg" },
];

// ---------------------------------------------------------------------------
// SEO defaults
// ---------------------------------------------------------------------------
const SEO = [
  { path: "/", metaTitle: "Homepage - Pi Techniques", metaDescription: "Systems and platforms built with care, and designed with purpose." },
  { path: "/about", metaTitle: "About Us - Pi Techniques", metaDescription: "Three decades of building with care and clarity." },
  { path: "/services", metaTitle: "Services - Pi Techniques", metaDescription: "Web and app services: we build for clarity and longevity." },
  { path: "/careers", metaTitle: "Career - Pi Techniques", metaDescription: "Let’s start with a conversation. You talk, we’ll build it from there." },
  { path: "/case-studies", metaTitle: "Case Studies - Pi Techniques", metaDescription: "Not just showcases, but solutions that work." },
  { path: "/contact-us", metaTitle: "Contact Us - Pi Techniques", metaDescription: "Get in touch with Pi Techniques." },
];

async function main(): Promise<void> {
  // --- Super Admin ---------------------------------------------------------
  const email = process.env.SEED_SUPERADMIN_EMAIL ?? "admin@pitechniques.com";
  const password = process.env.SEED_SUPERADMIN_PASSWORD ?? "ChangeMe!2025";
  const name = process.env.SEED_SUPERADMIN_NAME ?? "Super Admin";
  const rounds = Number(process.env.BCRYPT_ROUNDS ?? 12);
  const passwordHash = await bcrypt.hash(password, rounds);

  await prisma.user.upsert({
    where: { email },
    update: { name, role: Role.SUPER_ADMIN, isActive: true },
    create: { email, name, passwordHash, role: Role.SUPER_ADMIN, isActive: true },
  });
  console.log(`✔ Super Admin ready: ${email}`);

  // --- Services ------------------------------------------------------------
  for (let i = 0; i < SERVICES.length; i++) {
    const s = SERVICES[i];
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: { ...s, order: i },
      create: { ...s, order: i },
    });
  }
  console.log(`✔ Services: ${SERVICES.length}`);

  // --- Testimonials --------------------------------------------------------
  await prisma.testimonial.deleteMany({});
  await prisma.testimonial.createMany({
    data: TESTIMONIALS.map((t, i) => ({ ...t, order: i })),
  });
  console.log(`✔ Testimonials: ${TESTIMONIALS.length}`);

  // --- Clients -------------------------------------------------------------
  await prisma.client.deleteMany({});
  await prisma.client.createMany({
    data: CLIENTS.map((c, i) => ({
      name: c.name,
      logo: `/images/clients-logo/${c.logo}`,
      width: c.width ?? null,
      height: c.height ?? null,
      order: i,
    })),
  });
  console.log(`✔ Clients: ${CLIENTS.length}`);

  // --- Case studies (+ children) ------------------------------------------
  const order: Record<string, number> = { chanakya: 0, ibs: 1, citiusTech: 2, tajGroupofHotels: 3 };
  const variant: Record<string, string> = { tajGroupofHotels: "taj-features", citiusTech: "citius-features" };
  const cards: Record<string, { cardImage: string; cardImageMobile: string; cardClient: string; listImage: string; listHeading: string }> = {
    chanakya: { cardImage: "/images/chanakya.png", cardImageMobile: "/images/chanakya-mobile.jpg", cardClient: "Chanakya", listImage: "/images/case-studies/case-studies.png", listHeading: "chanakya | Fashion & LIFESTYLE" },
    ibs: { cardImage: "/images/ibs.png", cardImageMobile: "/images/ibs-mobile.jpg", cardClient: "IBSintelligence", listImage: "/images/case-studies/case-studies1.png", listHeading: "IBS intelligence | Fintech" },
    citiusTech: { cardImage: "/images/citius.png", cardImageMobile: "/images/citius-mobile.jpg", cardClient: "CitiusTech", listImage: "/images/case-studies/case-studies2.png", listHeading: "citiustech | healthcare Technology" },
    tajGroupofHotels: { cardImage: "/images/taj-ipad.png", cardImageMobile: "/images/taj-ipad-mobile.jpg", cardClient: "Taj Hotels", listImage: "/images/case-studies/laptop-4.png", listHeading: "taj | hospitality" },
  };

  await prisma.caseStudy.deleteMany({}); // cascades to children
  for (const [slug, p] of Object.entries(caseStudyProjects)) {
    await prisma.caseStudy.create({
      data: {
        slug,
        order: order[slug] ?? 0,
        published: true,
        name: p.projectInfo.name,
        title: p.topSection.title,
        shortDesc: p.topSection.shortDesc,
        tags: p.topSection.tags,
        heroImage: img(p.topSection.img),
        logo: img(p.topSection.logo),
        galleryImages: [],
        industry: p.projectInfo.projectDetails.industry,
        headquarters: p.projectInfo.projectDetails.headquarters,
        website: p.projectInfo.projectDetails.website ?? null,
        challengeShortInfo: p.challenges.shortInfo,
        challengeLists: p.challenges.lists,
        challengeBackground: p.challenges.background,
        solutionDetails: p.piSolution.details,
        longTermImpactTitle: p.longTermImpact.title,
        featureGridVariant: variant[slug] ?? "",
        cardImage: cards[slug]?.cardImage ?? "",
        cardImageMobile: cards[slug]?.cardImageMobile ?? "",
        cardClient: cards[slug]?.cardClient ?? "",
        listImage: cards[slug]?.listImage ?? "",
        listHeading: cards[slug]?.listHeading ?? "",
        solutions: {
          create: (p.piSolution.solutions ?? []).map((s, i) => ({
            title: s.title,
            subTitle: s.subTitle,
            items: s.list,
            order: i,
          })),
        },
        features: {
          create: p.keyFeature.map((f, i) => ({ image: img(f.img), feature: f.feature, order: i })),
        },
        impacts: {
          create: p.longTermImpact.impact.map((m, i) => ({
            image: img(m.img),
            title: m.title,
            subTitle: m.subTitle,
            order: i,
          })),
        },
      },
    });
  }
  console.log(`✔ Case studies: ${Object.keys(caseStudyProjects).length}`);

  // --- Home content (singleton) -------------------------------------------
  const homeData = {
    heroTitle: "Systems and platforms\nbuilt with care, and\ndesigned with purpose",
    heroSubtitle: "Every build is thought through, every design intentional.",
    heroCtaLabel: "Solutions offered",
    heroCtaHref: "/services",
    whoEyebrow: "who we are",
    whoTitle: "How we think & build",
    whoParagraphs: [
      "For over two decades, Pi Techniques has been helping businesses unlock the full potential of technology.",
      "Driven by innovation, grounded in simplicity, and committed to client success, is how we’ve built lasting partnerships with a loyal and diverse client base.",
      "At Pi Techniques, “always keep it simple” isn’t just a line, it’s a discipline. We cut through complexity to design technology that works intuitively, scales seamlessly, and solves real business challenges.",
    ],
    whoCtaLabel: "About us",
    whoCtaHref: "/about",
    aboutImage: "/images/newoffice1.jpg",
    statClients: 100,
    statProjects: 500,
    statIndustries: 15,
    servicesEyebrow: "OUR SERVICES",
    servicesTitle: "Strategy, design, and tech in action",
    workEyebrow: "our work",
    workTitle: "Dive into our case studies",
    clientsEyebrow: "OUR CLIENTS",
    clientsTitle: "Lasting partnerships",
    testimonialsEyebrow: "TESTIMONIALS",
    testimonialsTitle: "Voices of trust",
  };
  await prisma.homeContent.upsert({ where: { id: "home" }, update: homeData, create: { id: "home", ...homeData } });
  console.log("✔ Home content");

  // --- About page content (singleton) --------------------------------------
  const aboutData = {
    bannerTitle: "We keep it precise and\nsimple",
    bannerSubtitle: "Three decades of building with care and clarity.",
    introEyebrow: "ABOUT US",
    introTitle: "Rooted in experience.\nDriven by innovation.",
    introDescription: [
      "At Pi Techniques, we've been solving problems with tech since 1992. Beginning as a small support firm for individuals and home offices, and growing into a trusted, full-spectrum technology partner for modern businesses.",
      "Over the years, we’ve expanded into software development, web technologies, and IT infrastructure services. We have been delivering solutions that are tailored, reliable, and future-ready. Many of our clients have been with us for decades, a testament to our clear, simple, and client-first approach. No jargon, just measurable results.",
      "Backed by decades of experience, we create technology shaped around your business needs — reliable, scalable, and future-ready. Solutions that help grow with your business and keep pace with a fast-moving tech world.",
    ].join("\n\n"),
    whyHeading: "our agile process",
    whyTitle: "Adapting agility for smarter outcomes",
    whyDescription:
      "At Pi Techniques, we’ve learned that agility isn’t just a methodology, it’s a mindset. As client needs evolve, we adapt. That’s why we’ve embraced Agile Project Management. A proven, flexible framework that helps us stay aligned, responsive, and focused on what matters most: delivering results, fast.",
  };
  await prisma.aboutContent.upsert({ where: { id: "about" }, update: aboutData, create: { id: "about", ...aboutData } });

  const agileSteps = [
    { title: "Discover & Define", description: "We start by understanding your goals, challenges, and vision — laying the foundation with clear scope and priorities." },
    { title: "Plan & Prioritize", description: "With a product backlog in place, we break down work into sprints — short, focused cycles that help us move fast and stay focused." },
    { title: "Design & Develop", description: "Our teams build iteratively, sharing progress frequently and refining the solution at every stage." },
    { title: "Review & Collaborate", description: "At the end of each sprint, we present working features, gather feedback, and make sure we’re always aligned." },
    { title: "Test & Enhance", description: "Continuous testing and integration ensures high quality products. We don’t just fix bugs — we improve with each cycle." },
    { title: "Deliver & Support", description: "Once we go live, we’re still with you — providing support, enhancements, and a roadmap for what’s next." },
  ];
  for (const [i, step] of agileSteps.entries()) {
    await prisma.whyChooseFeature.upsert({
      where: { id: `seed-agile-${i}` },
      update: { ...step, order: i },
      create: { id: `seed-agile-${i}`, ...step, order: i },
    });
  }
  console.log("✔ About page content");

  // --- Contact page content (singleton) ------------------------------------
  const contactData = {
    locationHeading: "LOCATION",
    locationTitle: "Our headquarters",
    officeName: "Nariman Point",
    officeCity: "Mumbai",
    officeAddress: "61/63C Mittal Tower,\nNariman Point,\nMumbai - 400021",
    directionsUrl:
      "https://www.google.com/maps/place/Pi+Techniques+Pvt.+Ltd./@18.9251667,72.824424,17z/data=!3m1!4b1!4m6!3m5!1s0x3be7d1e97e031c0b:0x8a44b9ad6132d028!8m2!3d18.9251667!4d72.824424!16s%2Fg%2F1th5y83b?entry=ttu",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3774.140669523596!2d72.824424!3d18.9251667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7d1e97e031c0b%3A0x8a44b9ad6132d028!2sPi%20Techniques%20Pvt.%20Ltd.!5e0!3m2!1sen!2sin!4v1762169535718!5m2!1sen!2sin",
    formHeading: "Contact US",
    formTitle: "Get in touch",
    formIntro: "We're here to help and answer any questions you might have. We look forward to hearing from you.",
  };
  await prisma.contactContent.upsert({ where: { id: "contact" }, update: contactData, create: { id: "contact", ...contactData } });
  console.log("✔ Contact page content");

  // --- Site settings (singleton) ------------------------------------------
  const siteData = {
    companyEmail: "enquiry@pitechniques.com",
    companyPhone: "+91 22 6292 3333",
    addressLines: ["61/63C Mittal Tower,", "Nariman Point, Mumbai - 400021"],
    linkedinUrl: "https://in.linkedin.com/company/pi-techniques",
    footerNote: "Pi Techniques Pvt. Ltd. All rights reserved.",
  };
  await prisma.siteSetting.upsert({ where: { id: 1 }, update: siteData, create: { id: 1, ...siteData } });
  console.log("✔ Site settings");

  // --- SEO -----------------------------------------------------------------
  for (const s of SEO) {
    await prisma.seoSetting.upsert({ where: { path: s.path }, update: s, create: s });
  }
  console.log(`✔ SEO settings: ${SEO.length}`);

  // --- Team members --------------------------------------------------------
  const teamColSpan = (col: string): number => {
    const m = /col-xl-(\d+)/.exec(col);
    const n = m ? Number(m[1]) : 4;
    return n === 6 || n === 12 ? n : 4;
  };
  const teamRows = (list: AboutTeamMember[], group: "leadership" | "executive"): Prisma.TeamMemberCreateManyInput[] =>
    list.map((m, i) => ({
      name: m.name.trim(),
      role: m.role,
      photo: m.img ?? m.imgDesktop ?? "",
      photoMobile: m.imgMobile ?? null,
      colSpan: teamColSpan(m.col),
      cardMb0: m.cardMb0 ?? false,
      linkedin: m.linkedin ?? null,
      group,
      order: i,
      published: true,
    }));
  await prisma.teamMember.deleteMany({});
  await prisma.teamMember.createMany({
    data: [...teamRows(TEAM_LEADERS, "leadership"), ...teamRows(TEAM_EXECUTIVES, "executive")],
  });
  console.log(`✔ Team members: ${TEAM_LEADERS.length + TEAM_EXECUTIVES.length}`);

  // --- Navigation ----------------------------------------------------------
  await prisma.navItem.deleteMany({});
  await prisma.navItem.createMany({
    data: [
      { label: "About us", href: "/about", location: "HEADER", order: 0, published: true },
      { label: "Services", href: "/services", location: "HEADER", order: 1, published: true },
      { label: "Case studies", href: "/case-studies", location: "HEADER", order: 2, published: true },
      { label: "Careers", href: "/careers", location: "HEADER", order: 3, published: true },
    ],
  });
  console.log("✔ Navigation: 4 header items");

  // --- Jobs ----------------------------------------------------------------
  const respToJson = (r: FaithfulJob["responsibilities"]): Prisma.InputJsonValue | typeof Prisma.JsonNull => {
    if (!r) return Prisma.JsonNull;
    if (Array.isArray(r)) return r;
    return Object.entries(r).map(([heading, items]) => ({ heading, items }));
  };
  await prisma.job.deleteMany({});
  for (let i = 0; i < faithfulJobs.length; i++) {
    const j = faithfulJobs[i];
    await prisma.job.create({
      data: {
        jobTitle: j.title,
        slug: j.slug,
        jobCode: j.jobcode ?? null,
        experience: j.experience,
        qualifications: j.qualifications,
        responsibilities: respToJson(j.responsibilities),
        skills: j.skills ?? [],
        status: "ACTIVE",
        displayOrder: i,
      },
    });
  }
  console.log(`✔ Jobs: ${faithfulJobs.length}`);

  // --- Home stats / counters ----------------------------------------------
  await prisma.homeStat.deleteMany({});
  await prisma.homeStat.createMany({
    data: [
      { value: 100, label: "NUMBER OF CLIENTS", suffix: "+", order: 0 },
      { value: 500, label: "PROJECTS DELIVERED", suffix: "+", order: 1 },
      { value: 15, label: "INDUSTRIES SERVED", suffix: "+", order: 2 },
    ],
  });
  console.log("✔ Home stats: 3 counters");

  console.log("\n🌱 Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
