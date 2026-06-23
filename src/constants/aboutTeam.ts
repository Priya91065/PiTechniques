/** Team members for the About page (faithful copy of about.php). */
export interface TeamMember {
  name: string;
  role: string;
  /** Single responsive image. */
  img?: string;
  /** Dual image (desktop/mobile) — used by the group photos. */
  imgDesktop?: string;
  imgMobile?: string;
  /** Breakpoint at which the desktop/mobile images swap. */
  dualBp?: "md" | "xl";
  linkedin?: string;
  /** Bootstrap column classes for the card wrapper. */
  col: string;
  /** Whether the inner .card carries mb-0. */
  cardMb0?: boolean;
}

const T = "/images/about/team-members";
const LEAD_COL = "col-6 col-md-6 col-xl-4 team-card";

export const leaders: TeamMember[] = [
  { name: "Shyamal Swali", role: "Founder & Director", img: `${T}/shyamal.jpg`, linkedin: "https://in.linkedin.com/in/shyamal-swali-b6a23169", col: LEAD_COL },
  { name: "Hiten Damania", role: "Head of Delivery", img: `${T}/hiten.jpg`, linkedin: "https://in.linkedin.com/in/hiten-damania", col: LEAD_COL },
  { name: "Tarun Kapadia", role: "Product Delivery Lead", img: `${T}/tarun.jpg`, linkedin: "https://in.linkedin.com/in/tarun-kapadia-89965645", col: LEAD_COL },
  { name: "Hemang Choksi", role: "Lead Solution Architect", img: `${T}/hemang.jpg`, linkedin: "https://in.linkedin.com/in/hemang-choksi", col: LEAD_COL },
  { name: "Sagar Shirke", role: "Product Implementation Lead", img: `${T}/sagar.jpg`, linkedin: "https://in.linkedin.com/in/sagar-shirke-2581bb23", col: LEAD_COL },
  { name: "Firdaus Minocher", role: "Business Process Strategist", img: `${T}/firdaus.jpg`, linkedin: "https://in.linkedin.com/in/firdaus-minocher-4a136173", col: LEAD_COL, cardMb0: true },
  { name: "Abhijit Wagh", role: "Product Implementation Lead", img: `${T}/abhijit.jpg`, linkedin: "https://in.linkedin.com/in/abhi-wagh", col: LEAD_COL, cardMb0: true },
  { name: "Punit Jain", role: "Delivery Manager", img: `${T}/punit.jpg`, linkedin: "https://www.linkedin.com/in/punitjain1989", col: LEAD_COL, cardMb0: true },
];

export const executives: TeamMember[] = [
  { name: "Vibhavari Gorakh", role: "Technical Lead - Data Platforms", img: `${T}/vibhavari.jpg`, linkedin: "https://in.linkedin.com/in/vibhavari-gorakh-25b8421a4", col: LEAD_COL },
  { name: "Khyati Parikh", role: "Product Manager", img: `${T}/khyati.jpg`, linkedin: "https://www.linkedin.com/in/khyati-parikh-6b6b55a4", col: LEAD_COL },
  { name: "Pravin Jadhav", role: "Web Development Lead", img: `${T}/pravin.jpg`, linkedin: "https://in.linkedin.com/in/pravinjd87", col: LEAD_COL },
  { name: "Monaz Katila", role: "Design Lead", img: `${T}/monaz.jpg`, linkedin: "https://in.linkedin.com/in/monaz-katila-94537684", col: LEAD_COL },
  { name: "Shivam Vyas", role: "Application Support Lead", img: `${T}/shivam.jpg`, linkedin: "https://in.linkedin.com/in/shivamnvyas", col: LEAD_COL, cardMb0: true },
  { name: "Payal Selvaswala", role: "H.R.", img: `${T}/payal.jpg`, linkedin: "https://in.linkedin.com/in/payal-selvaswala-8094b1215", col: LEAD_COL },
  {
    name: "Rajendra & Vicky",
    role: "Infrastructure Services Lead",
    imgDesktop: `${T}/infra-service-lead.jpg`,
    imgMobile: `${T}/infra-service-lead-mob.jpg`,
    dualBp: "md",
    col: "col-6 col-md-6 col-xl-6 team-card",
  },
  {
    name: "Rakesh, Manoj & Dakshata ",
    role: "Admin Squad",
    imgDesktop: `${T}/administrative-team.jpg`,
    imgMobile: `${T}/administrative-team-mob.jpg`,
    dualBp: "md",
    col: "col-6 col-md-6 col-xl-6 team-card",
  },
  {
    name: "Nitin, Anil & Ashok bhau",
    role: "GroundOps Crew",
    imgDesktop: `${T}/support_team.jpg`,
    imgMobile: `${T}/support_team_mob.jpg`,
    dualBp: "xl",
    col: "col-6 col-md-6 col-xl-12 team-card",
    cardMb0: true,
  },
];

/** Key-industries cards for the About page. */
export const industries: { img: string; title: string; extraClass?: string }[] = [
  { img: "Maritime.png", title: "Maritime\nTech" },
  { img: "Omnichannel.png", title: "Omnichannel & \nRetail Experience", extraClass: "omnichannel" },
  { img: "Print.png", title: "Print Innovation & \nSmart Packaging" },
  { img: "Tech.png", title: "Tech-Enabled Service Providers" },
  { img: "Digital.png", title: "Digital Commerce & Online Marketplace" },
  { img: "Legal.png", title: "LegalTech & Digital Compliance" },
  { img: "Fashion.png", title: "Fashion, Lifestyle & Digital Brands" },
  { img: "Edtech.png", title: "EdTech & Learning Solutions" },
];
