import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { leaders as FALLBACK_LEADERS, executives as FALLBACK_EXECUTIVES, type TeamMember as PublicTeamMember } from "@/constants/aboutTeam";

export type { PublicTeamMember };

export interface TeamGroups {
  leaders: PublicTeamMember[];
  executives: PublicTeamMember[];
}

interface TeamRow {
  name: string;
  role: string;
  photo: string | null;
  photoMobile: string | null;
  colSpan: number;
  cardMb0: boolean;
  linkedin: string | null;
  group: string;
}

/** Map a DB row to the About-page card shape (deriving column classes + dual images). */
function toCard(r: TeamRow): PublicTeamMember {
  const col = `col-6 col-md-6 col-xl-${r.colSpan} team-card`;
  const base: PublicTeamMember = {
    name: r.name,
    role: r.role,
    col,
    ...(r.cardMb0 ? { cardMb0: true } : {}),
    ...(r.linkedin ? { linkedin: r.linkedin } : {}),
  };
  if (r.photoMobile) {
    return { ...base, imgDesktop: r.photo ?? "", imgMobile: r.photoMobile, dualBp: r.colSpan === 12 ? "xl" : "md" };
  }
  return { ...base, img: r.photo ?? "" };
}

const cached = unstable_cache(
  async (): Promise<TeamGroups | null> => {
    try {
      const rows = await prisma.teamMember.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
        select: {
          name: true,
          role: true,
          photo: true,
          photoMobile: true,
          colSpan: true,
          cardMb0: true,
          linkedin: true,
          group: true,
        },
      });
      if (rows.length === 0) return null;
      return {
        leaders: rows.filter((r) => r.group === "leadership").map(toCard),
        executives: rows.filter((r) => r.group === "executive").map(toCard),
      };
    } catch {
      return null;
    }
  },
  ["public-team"],
  { tags: ["team"], revalidate: 3600 },
);

/** Published team members grouped for the About page; falls back to the original constants. */
export async function getTeamGroups(): Promise<TeamGroups> {
  const db = await cached();
  return db ?? { leaders: FALLBACK_LEADERS, executives: FALLBACK_EXECUTIVES };
}
