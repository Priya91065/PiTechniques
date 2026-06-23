import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";

export interface PublicService {
  id: string;
  slug: string;
  anchor: string;
  title: string;
  description: string;
  iconDark: string;
  iconLight: string;
  tags: string[];
}

const HL = "/images/home-lottie";
const SL = "/images/services-lottie";

/** Fallback — keeps the homepage service grid + services page pixel-perfect. */
const FALLBACK: PublicService[] = [
  {
    id: "s1",
    slug: "application_development",
    anchor: "application_development",
    title: "Tailored and templated apps that make an impact",
    iconDark: `${HL}/Tailored.png`,
    iconLight: `${SL}/Tailored.png`,
    description:
      "Our application development is focused on solving real business challenges. With a sharp eye for usability and a passion for performance, we build streamlined, scalable apps that move with your business—fast, smart, and future-ready.",
    tags: ["MERN", "MEAN", "Enterprise .NET + SQL", "Java Solutions", "AI & Automation", "Data & Messaging"],
  },
  {
    id: "s2",
    slug: "AIPowered",
    anchor: "AIPowered",
    title: "Harnessing generative AI for real-world impact",
    iconDark: `${HL}/Harnessing-black.png`,
    iconLight: `${SL}/Harnessingwhite.png`,
    description:
      "We design and build intelligent solutions powered by leading generative AI models—both open-source and enterprise-grade. From conversational chatbots that streamline customer interactions to agentic AI agents that automate complex workflows, our team turns the latest AI capabilities into practical business tools.\n\nWhether it’s enhancing customer experience, boosting operational efficiency, or enabling smarter decision-making, we make AI work for you.",
    tags: ["OpenAI (GPT Models)", "Ollama", "LangChain", "Llama 2", "RAG", "Hugging Face"],
  },
  {
    id: "s3",
    slug: "Strategic_intelligence",
    anchor: "Strategic_intelligence",
    title: "Strategic intelligence, real-time decisions",
    iconDark: `${HL}/Strategic-Integlligence.png`,
    iconLight: `${SL}/Strategic-Integlligence.png`,
    description:
      "Harness the power of advanced analytics to drive measurable business outcomes. Our BI solutions deliver precision, visibility, and control — giving leaders the confidence to act with speed and accuracy in an evolving market.",
    tags: ["ETL & Data Pipelines", "PowerBI", "SQLBI", "DevExpress", "Database Integration & API"],
  },
  {
    id: "s4",
    slug: "Sleek_interfaces",
    anchor: "Sleek_interfaces",
    title: "Sleek interfaces complimenting effortless journeys",
    iconDark: `${HL}/Sleek-Interface.png`,
    iconLight: `${SL}/Sleek-Interface.png`,
    description:
      "We craft intuitive digital experiences that don’t just look good—they feel right. Every pixel is placed with purpose, blending aesthetic brilliance with seamless functionality. Your application deserves design that’s as bold as your vision.",
    tags: ["Figma", "Axure"],
  },
  {
    id: "s5",
    slug: "mobile_innovation",
    anchor: "mobile_innovation",
    title: "Strategic mobile innovation built with precision",
    iconDark: `${HL}/Strartegic-Mobile.png`,
    iconLight: `${SL}/Strartegic-Mobile.png`,
    description:
      "We craft sleek, high-impact mobile apps that don’t just function—they flow. Built with cutting-edge tech and serious design chops, our iOS and Android apps are smooth, scalable, and ready to wow. Whether it's a bold startup or a big idea, we turn screens into seamless experiences.",
    tags: ["Native iOS", "Native Android", "Xamarin", "React Native", "App Store & Play Store Deployment"],
  },
  {
    id: "s6",
    slug: "web-experiences",
    anchor: "web-experiences",
    title: "Web experiences that click",
    iconDark: `${HL}/Webexperincesblack.png`,
    iconLight: `${SL}/Web-experinces.png`,
    description:
      "We don’t just build websites — we craft digital playgrounds that look stunning, work flawlessly, and convert effortlessly. Whether you're a startup or scaling up, our team blends design, tech, and strategy to deliver custom, high-performance web experiences that set you apart. Fully responsive, mobile-first, and built for tomorrow.",
    tags: ["Angular JS", "Next.js", "MVC", "HTML5 & CSS3", "Wordpress", "Woo Commerce", "SEO & Performance Optimization"],
  },
  {
    id: "s7",
    slug: "Infrastructure",
    anchor: "Infrastructure",
    title: "Infrastructure that scales, DevOps that delivers",
    iconDark: `${HL}/Infrastructure.png`,
    iconLight: `${SL}/Infrastructure.png`,
    description:
      "We build and manage cloud-native, resilient infrastructures designed for growth. Our DevOps approach automates the pipeline—from code to deployment—so your applications are delivered faster, safer, and smarter. With monitoring, security, and optimization baked in, we keep your systems running at peak performance while you focus on innovation.",
    tags: ["CI/CD Pipelines", "Docker & Kubernetes", "Containerization & Orchestration", "Networking", "Hardware", "Firewall", "Security", "Hosting"],
  },
  {
    id: "s8",
    slug: "creatingSeamlessWorkflows",
    anchor: "creatingSeamlessWorkflows",
    title: "Connecting systems, creating seamless workflows",
    iconDark: `${HL}/Connectingblack.png`,
    iconLight: `${SL}/Connectingwhite.png`,
    description:
      "Your applications work better when they work together. We unify them into an intelligent ecosystem that reduces friction, enhances collaboration, and helps your business move with greater speed and agility.",
    tags: ["Zoho", "Salesforce", "Shopify", "SAP"],
  },
];

export const getServices = unstable_cache(
  async (): Promise<PublicService[]> => {
    try {
      const rows = await prisma.service.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
        select: {
          id: true,
          slug: true,
          anchor: true,
          title: true,
          description: true,
          iconDark: true,
          iconLight: true,
          tags: true,
        },
      });
      return rows.length > 0 ? rows : FALLBACK;
    } catch {
      return FALLBACK;
    }
  },
  ["public-services"],
  { tags: ["services"], revalidate: 3600 },
);
