import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { teamMemberInput } from "@/lib/validation/teamMember";
import { createTeamMember, listTeamMembers } from "@/server/services/teamMembers";

export async function GET(): Promise<NextResponse> {
  const g = await guard();
  if ("response" in g) return g.response;
  try {
    return jsonOk({ items: await listTeamMembers() });
  } catch {
    return jsonError("Couldn't load team members. Is the database connected?", 503, "DB_UNAVAILABLE");
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const g = await guard("CREATE");
  if ("response" in g) return g.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }
  const parsed = teamMemberInput.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422);

  const item = await createTeamMember(parsed.data);
  await prisma.activityLog.create({
    data: {
      userId: g.user.sub,
      action: "CREATE",
      entityType: "TeamMember",
      entityId: item.id,
      summary: `Created team member "${item.name}"`,
    },
  });

  revalidateTag("team");
  revalidatePath("/about");
  return jsonOk({ item }, 201);
}
