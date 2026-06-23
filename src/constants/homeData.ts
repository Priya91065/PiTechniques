import type {
  HomeCaseCard,
  ServiceCard,
  Testimonial,
} from "@/types";

/** Eight service cards shown on the homepage "Our services" grid. */
export const homeServiceCards: ServiceCard[] = [
  {
    anchor: "/services#application_development",
    icon: "/images/home-lottie/Tailored.png",
    title: "Tailored and templated apps that make an impact",
    tags: [
      "MERN",
      "MEAN",
      "Enterprise .NET + SQL",
      "Java Solutions",
      "AI & Automation",
      "Data & Messaging",
    ],
  },
  {
    anchor: "/services#AIPowered",
    icon: "/images/home-lottie/Harnessing-black.png",
    title: "Harnessing generative AI for real-world impact",
    tags: ["OpenAI (GPT Models)", "Ollama", "LangChain", "Llama 2", "RAG", "Hugging Face"],
  },
  {
    anchor: "/services#Strategic_intelligence",
    icon: "/images/home-lottie/Strategic-Integlligence.png",
    title: "Strategic intelligence, real-time decisions",
    tags: ["ETL & Data Pipelines", "PowerBI", "SQLBI", "DevExpress", "Database Integration & API"],
  },
  {
    anchor: "/services#Sleek_interfaces",
    icon: "/images/home-lottie/Sleek-Interface.png",
    title: "Sleek interfaces complimenting effortless journeys",
    tags: ["Figma", "Axure"],
  },
  {
    anchor: "/services#mobile_innovation",
    icon: "/images/home-lottie/Strartegic-Mobile.png",
    title: "Strategic mobile innovation built with precision",
    tags: ["Native iOS", "Native Android", "Xamarin", "React Native", "App Store & Play Store Deployment"],
  },
  {
    anchor: "/services#web-experiences",
    icon: "/images/home-lottie/Webexperincesblack.png",
    title: "Web experiences that click",
    tags: ["Angular JS", "Next.js", "MVC", "HTML5 & CSS3", "Wordpress", "Woo Commerce", "SEO & Performance Optimization"],
  },
  {
    anchor: "/services#Infrastructure",
    icon: "/images/home-lottie/Infrastructure.png",
    title: "Infrastructure that scales, DevOps that delivers",
    tags: ["CI/CD Pipelines", "Docker & Kubernetes", "Containerization & Orchestration", "Networking", "Hardware", "Firewall", "Security", "Hosting"],
  },
  {
    anchor: "/services#creatingSeamlessWorkflows",
    icon: "/images/home-lottie/Connectingblack.png",
    title: "Connecting systems, creating seamless workflows",
    tags: ["Zoho", "Salesforce", "Shopify", "SAP"],
  },
];

/** Four case-study cards for the homepage carousel. */
export const homeCaseCards: HomeCaseCard[] = [
  {
    slug: "chanakya",
    title: "Threading technology into fashion",
    client: "Chanakya",
    image: "/images/case-studies/case-studies.png",
  },
  {
    slug: "tajGroupofHotels",
    title: "A premium car rental management system",
    client: "Taj Hotels",
    image: "/images/case-studies/laptop-4.png",
  },
  {
    slug: "citiusTech",
    title: "The strong and steady ERP evolution",
    client: "CitiusTech",
    image: "/images/case-studies/case-studies2.png",
  },
  {
    slug: "ibs",
    title: "Transforming fintech publishing",
    client: "IBSintelligence",
    image: "/images/case-studies/case-studies1.png",
  },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "Integration was always a challenge for us until Pi Techniques stepped in. They simplified our infrastructure, ensured smooth connectivity across systems, and gave us the reliability and scalability we needed. Their solutions have saved us both time and costs.",
    company: "Metro Shoes",
    attribution: "Aashish Mashruwala,",
    role: "Business Head of Metro Shoes",
  },
  {
    quote:
      "As strategic branding consultants, the design and execution of websites for our clients are critical. Our design solutions are always a marriage between a signature brand language and a relevant UI UX. And in this mix - Pi Techniques always steps in with a near perfect understanding of the detailed execution we require, along with great support and domain knowledge.",
    company: "Rabia Gupta Designs",
    attribution: "Rabia Gupta,",
    role: "Founder",
  },
  {
    quote:
      "Our members expect premium experiences both offline and online. Pi Techniques designed and developed a web platform that makes everything — from logins to payments — effortless. Their team balanced design, security, and ease of use seamlessly.",
    company: "The Willingdon Sports Club",
    attribution: "Gururaj Joshi,",
    role: "Dy Manager EDP",
  },
  {
    quote:
      "We wanted our website to reflect the warmth and uniqueness of our brand. Pi Techniques delivered exactly that. The site is elegant, easy to navigate, and truly captures who we are. Their team was creative, patient, and extremely supportive.",
    company: "The Nutcracker",
    attribution: "Annie Bafna,",
    role: "Founder",
  },
  {
    quote:
      "Pi Techniques has been a true partner in our digital transformation journey. Their ability to understand our complex requirements and translate them into simple, scalable solutions has been invaluable. They don't just deliver technology — they help us think ahead.",
    company: "Chanakya",
    attribution: "Anisha Shetty,",
    role: "Chief of Atelier",
  },
  {
    quote:
      "Our website plays a crucial role in telling the stories of the cancer warriors and families we care for. With Pi Techniques leading our website redesign, we got not just a sleek design transformation but a meaningful enhancement in how we showcase our cause and its impact. They blended creativity with clarity, improving the user experience while staying true to our core values. We're grateful for their support and expertise.",
    company: "St. Jude India ChildCare Centres",
    attribution: "Anil Nair,",
    role: "CEO",
  },
];

/** Client logos for the marquee. width/height drive aspect ratio. */
export const clientLogos: { src: string; w?: number; h: number }[] = [
  { src: "/images/clients-logo/chanakya.svg", w: 320, h: 80 },
  { src: "/images/clients-logo/v-group.svg", w: 90, h: 67 },
  { src: "/images/clients-logo/wri.svg", h: 88 },
  { src: "/images/clients-logo/sea-tec.svg", w: 152, h: 56 },
  { src: "/images/clients-logo/taj.svg", w: 118, h: 104 },
  { src: "/images/clients-logo/citius.png", h: 56 },
  { src: "/images/clients-logo/metro.png", h: 56 },
  { src: "/images/clients-logo/bdl-logo.svg", w: 132, h: 117 },
  { src: "/images/clients-logo/oceanic.svg", w: 225, h: 38 },
  { src: "/images/clients-logo/cotton-world.svg", h: 61 },
  { src: "/images/clients-logo/willington.svg", w: 66, h: 100 },
  { src: "/images/clients-logo/nutcracker.svg", h: 87 },
  { src: "/images/clients-logo/crownvet.png", h: 80 },
  { src: "/images/clients-logo/westwind.png", h: 80 },
  { src: "/images/clients-logo/honey-bees.svg", w: 128, h: 128 },
  { src: "/images/clients-logo/sohfit.svg", w: 222, h: 60 },
  { src: "/images/clients-logo/littlepplamsschool.svg", h: 80 },
  { src: "/images/clients-logo/adnd-logo.svg", h: 80 },
  { src: "/images/clients-logo/kizazi.svg", h: 80 },
  { src: "/images/clients-logo/chorus-logo-black.svg", h: 80 },
  { src: "/images/clients-logo/JadeLogoNew.svg", h: 80 },
  { src: "/images/clients-logo/rgd-logo.svg", h: 80 },
  { src: "/images/clients-logo/zaka-logo.svg", h: 80 },
  { src: "/images/clients-logo/amaya.svg", h: 80 },
];
