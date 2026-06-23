import type { Industry, ProcessStep, TeamMember } from "@/types";

export const industries: Industry[] = [
  { icon: "/images/about-lottie/Maritime.png", title: "Maritime\nTech" },
  { icon: "/images/about-lottie/Omnichannel.png", title: "Omnichannel &\nRetail Experience" },
  { icon: "/images/about-lottie/Print.png", title: "Print Innovation &\nSmart Packaging" },
  { icon: "/images/about-lottie/Tech.png", title: "Tech-Enabled Service Providers" },
  { icon: "/images/about-lottie/Digital.png", title: "Digital Commerce & Online Marketplace" },
  { icon: "/images/about-lottie/Legal.png", title: "LegalTech & Digital Compliance" },
  { icon: "/images/about-lottie/Fashion.png", title: "Fashion, Lifestyle & Digital Brands" },
  { icon: "/images/about-lottie/Edtech.png", title: "EdTech & Learning Solutions" },
];

export const agileSteps: ProcessStep[] = [
  {
    title: "Discover & Define",
    description:
      "We start by understanding your goals, challenges, and vision — laying the foundation with clear scope and priorities.",
  },
  {
    title: "Plan & Prioritize",
    description:
      "With a product backlog in place, we break down work into sprints — short, focused cycles that help us move fast and stay focused.",
  },
  {
    title: "Design & Develop",
    description:
      "Our teams build iteratively, sharing progress frequently and refining the solution at every stage.",
  },
  {
    title: "Review & Collaborate",
    description:
      "At the end of each sprint, we present working features, gather feedback, and make sure we're always aligned.",
  },
  {
    title: "Test & Enhance",
    description:
      "Continuous testing and integration ensures high quality products. We don't just fix bugs — we improve with each cycle.",
  },
  {
    title: "Deliver & Support",
    description:
      "Once we go live, we're still with you — providing support, enhancements, and a roadmap for what's next.",
  },
];

/** Core leadership grid. */
export const leadershipTeam: TeamMember[] = [
  { name: "Shyamal Swali", role: "Founder & Director", image: "/images/about/team-members/shyamal.jpg", linkedin: "https://in.linkedin.com/in/shyamal-swali-b6a23169" },
  { name: "Hiten Damania", role: "Head of Delivery", image: "/images/about/team-members/hiten.jpg", linkedin: "https://in.linkedin.com/in/hiten-damania" },
  { name: "Tarun Kapadia", role: "Product Delivery Lead", image: "/images/about/team-members/tarun.jpg", linkedin: "https://in.linkedin.com/in/tarun-kapadia-89965645" },
  { name: "Hemang Choksi", role: "Lead Solution Architect", image: "/images/about/team-members/hemang.jpg", linkedin: "https://in.linkedin.com/in/hemang-choksi" },
  { name: "Sagar Shirke", role: "Product Implementation Lead", image: "/images/about/team-members/sagar.jpg", linkedin: "https://in.linkedin.com/in/sagar-shirke-2581bb23" },
  { name: "Firdaus Minocher", role: "Business Process Strategist", image: "/images/about/team-members/firdaus.jpg", linkedin: "https://in.linkedin.com/in/firdaus-minocher-4a136173" },
  { name: "Abhijit Wagh", role: "Product Implementation Lead", image: "/images/about/team-members/abhijit.jpg", linkedin: "https://in.linkedin.com/in/abhi-wagh" },
  { name: "Punit Jain", role: "Delivery Manager", image: "/images/about/team-members/punit.jpg", linkedin: "https://www.linkedin.com/in/punitjain1989" },
];

/** Executive team grid (mix of single & grouped photo tiles). */
export const executiveTeam: TeamMember[] = [
  { name: "Vibhavari Gorakh", role: "Technical Lead - Data Platforms", image: "/images/about/team-members/vibhavari.jpg", linkedin: "https://in.linkedin.com/in/vibhavari-gorakh-25b8421a4", span: "third" },
  { name: "Khyati Parikh", role: "Product Manager", image: "/images/about/team-members/khyati.jpg", linkedin: "https://www.linkedin.com/in/khyati-parikh-6b6b55a4", span: "third" },
  { name: "Pravin Jadhav", role: "Web Development Lead", image: "/images/about/team-members/pravin.jpg", linkedin: "https://in.linkedin.com/in/pravinjd87", span: "third" },
  { name: "Monaz Katila", role: "Design Lead", image: "/images/about/team-members/monaz.jpg", linkedin: "https://in.linkedin.com/in/monaz-katila-94537684", span: "third" },
  { name: "Shivam Vyas", role: "Application Support Lead", image: "/images/about/team-members/shivam.jpg", linkedin: "https://in.linkedin.com/in/shivamnvyas", span: "third" },
  { name: "Payal Selvaswala", role: "H.R.", image: "/images/about/team-members/payal.jpg", linkedin: "https://in.linkedin.com/in/payal-selvaswala-8094b1215", span: "third" },
  { name: "Rajendra & Vicky", role: "Infrastructure Services Lead", image: "/images/about/team-members/infra-service-lead.jpg", span: "half" },
  { name: "Rakesh, Manoj & Dakshata", role: "Admin Squad", image: "/images/about/team-members/administrative-team.jpg", span: "half" },
  { name: "Nitin, Anil & Ashok bhau", role: "GroundOps Crew", image: "/images/about/team-members/support_team.jpg", span: "full" },
];
