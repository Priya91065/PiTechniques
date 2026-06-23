import type { ServiceDetail, ServiceLottieLink } from "@/types";

/** The 8 anchored quick-link cards under the intro. */
export const serviceLinks: ServiceLottieLink[] = [
  { anchor: "#application_development", icon: "/images/services-lottie/Tailored.png", title: "Tailored and templated apps that make an impact" },
  { anchor: "#AIPowered", icon: "/images/services-lottie/Harnessingwhite.png", title: "Harnessing generative AI for real-world impact" },
  { anchor: "#Strategic_intelligence", icon: "/images/services-lottie/Strategic-Integlligence.png", title: "Strategic intelligence, real-time decisions" },
  { anchor: "#Sleek_interfaces", icon: "/images/services-lottie/Sleek-Interface.png", title: "Sleek interfaces complimenting effortless journeys" },
  { anchor: "#mobile_innovation", icon: "/images/services-lottie/Strartegic-Mobile.png", title: "Strategic mobile innovation built with precision" },
  { anchor: "#web-experiences", icon: "/images/services-lottie/Web-experinces.png", title: "Web experiences that click" },
  { anchor: "#Infrastructure", icon: "/images/services-lottie/Infrastructure.png", title: "Infrastructure that scales, DevOps that delivers" },
  { anchor: "#creatingSeamlessWorkflows", icon: "/images/services-lottie/Connectingwhite.png", title: "Connecting systems, creating seamless workflows" },
];

/** Detailed service blocks (icon, title, copy, tags). */
export const serviceDetails: ServiceDetail[] = [
  {
    id: "application_development",
    icon: "/images/home-lottie/Tailored.png",
    title: "Tailored and templated apps that make an impact",
    paragraphs: [
      "Our application development is focused on solving real business challenges. With a sharp eye for usability and a passion for performance, we build streamlined, scalable apps that move with your business—fast, smart, and future-ready.",
    ],
    tags: ["MERN", "MEAN", "Enterprise .NET + SQL", "Java Solutions", "AI & Automation", "Data & Messaging"],
  },
  {
    id: "AIPowered",
    icon: "/images/home-lottie/Harnessing-black.png",
    title: "Harnessing generative AI for real-world impact",
    paragraphs: [
      "We design and build intelligent solutions powered by leading generative AI models—both open-source and enterprise-grade. From conversational chatbots that streamline customer interactions to agentic AI agents that automate complex workflows, our team turns the latest AI capabilities into practical business tools.",
      "Whether it's enhancing customer experience, boosting operational efficiency, or enabling smarter decision-making, we make AI work for you.",
    ],
    tags: ["OpenAI (GPT Models)", "Ollama", "LangChain", "Llama 2", "RAG", "Hugging Face"],
  },
  {
    id: "Strategic_intelligence",
    icon: "/images/home-lottie/Strategic-Integlligence.png",
    title: "Strategic intelligence, real-time decisions",
    paragraphs: [
      "Harness the power of advanced analytics to drive measurable business outcomes. Our BI solutions deliver precision, visibility, and control — giving leaders the confidence to act with speed and accuracy in an evolving market.",
    ],
    tags: ["ETL & Data Pipelines", "PowerBI", "SQLBI", "DevExpress", "Database Integration & API"],
  },
  {
    id: "Sleek_interfaces",
    icon: "/images/home-lottie/Sleek-Interface.png",
    title: "Sleek interfaces complimenting effortless journeys",
    paragraphs: [
      "We craft intuitive digital experiences that don't just look good—they feel right. Every pixel is placed with purpose, blending aesthetic brilliance with seamless functionality. Your application deserves design that's as bold as your vision.",
    ],
    tags: ["Figma", "Axure"],
  },
  {
    id: "mobile_innovation",
    icon: "/images/home-lottie/Strartegic-Mobile.png",
    title: "Strategic mobile innovation built with precision",
    paragraphs: [
      "We craft sleek, high-impact mobile apps that don't just function—they flow. Built with cutting-edge tech and serious design chops, our iOS and Android apps are smooth, scalable, and ready to wow. Whether it's a bold startup or a big idea, we turn screens into seamless experiences.",
    ],
    tags: ["Native iOS", "Native Android", "Xamarin", "React Native", "App Store & Play Store Deployment"],
  },
  {
    id: "web-experiences",
    icon: "/images/home-lottie/Webexperincesblack.png",
    title: "Web experiences that click",
    paragraphs: [
      "We don't just build websites — we craft digital playgrounds that look stunning, work flawlessly, and convert effortlessly. Whether you're a startup or scaling up, our team blends design, tech, and strategy to deliver custom, high-performance web experiences that set you apart. Fully responsive, mobile-first, and built for tomorrow.",
    ],
    tags: ["Angular JS", "Next.js", "MVC", "HTML5 & CSS3", "Wordpress", "Woo Commerce", "SEO & Performance Optimization"],
  },
  {
    id: "Infrastructure",
    icon: "/images/home-lottie/Infrastructure.png",
    title: "Infrastructure that scales, DevOps that delivers",
    paragraphs: [
      "We build and manage cloud-native, resilient infrastructures designed for growth. Our DevOps approach automates the pipeline—from code to deployment—so your applications are delivered faster, safer, and smarter. With monitoring, security, and optimization baked in, we keep your systems running at peak performance while you focus on innovation.",
    ],
    tags: ["CI/CD Pipelines", "Docker & Kubernetes", "Containerization & Orchestration", "Networking", "Hardware", "Firewall", "Security", "Hosting"],
  },
  {
    id: "creatingSeamlessWorkflows",
    icon: "/images/home-lottie/Connectingblack.png",
    title: "Connecting systems, creating seamless workflows",
    paragraphs: [
      "Your applications work better when they work together. We unify them into an intelligent ecosystem that reduces friction, enhances collaboration, and helps your business move with greater speed and agility.",
    ],
    tags: ["Zoho", "Salesforce", "Shopify", "SAP"],
  },
];
