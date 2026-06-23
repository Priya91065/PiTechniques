import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { teamMemberInput } from "@/lib/validation/teamMember";
import { deleteTeamMember, updateTeamMember } from "@/server/services/teamMembers";

type Ctx = { params: Promise<{ id: string }> };

function revalidate(): void {
  revalidateTag("team");
  revalidatePath("/about");
}

export async function PATCH(req: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const g = await guard("EDIT");
  if ("response" in g) return g.response;
  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }
  const parsed = teamMemberInput.partial().safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422);

  const existing = await prisma.teamMember.findUnique({ where: { id } });
  if (!existing) return jsonError("Team member not found", 404);

  const item = await updateTeamMember(id, parsed.data);
  await prisma.activityLog.create({
    data: {
      userId: g.user.sub,
      action: parsed.data.published !== undefined ? "PUBLISH" : "UPDATE",
      entityType: "TeamMember",
      entityId: id,
      summary: `Updated team member "${item.name}"`,
    },
  });
  revalidate();
  return jsonOk({ item });
}

export async function DELETE(_req: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const g = await guard("DELETE");
  if ("response" in g) return g.response;
  const { id } = await params;

  const existing = await prisma.teamMember.findUnique({ where: { id } });
  if (!existing) return jsonError("Team member not found", 404);

  await deleteTeamMember(id);
  await prisma.activityLog.create({
    data: {
      userId: g.user.sub,
      action: "DELETE",
      entityType: "TeamMember",
      entityId: id,
      summary: `Deleted team member "${existing.name}"`,
    },
  });
  revalidate();
  return jsonOk({ ok: true });
}
