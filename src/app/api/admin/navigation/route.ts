import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { navItemInput } from "@/lib/validation/navItem";
import { createNavItem, listNavItems } from "@/server/services/navItems";

export async function GET(): Promise<NextResponse> {
  const g = await guard();
  if ("response" in g) return g.response;
  try {
    return jsonOk({ items: await listNavItems() });
  } catch {
    return jsonError("Couldn't load navigation. Is the database connected?", 503, "DB_UNAVAILABLE");
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
  const parsed = navItemInput.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422);

  const item = await createNavItem(parsed.data);
  await prisma.activityLog.create({
    data: {
      userId: g.user.sub,
      action: "CREATE",
      entityType: "NavItem",
      entityId: item.id,
      summary: `Created nav item "${item.label}"`,
    },
  });
  revalidateTag("navigation");
  revalidatePath("/", "layout");
  return jsonOk({ item }, 201);
}
