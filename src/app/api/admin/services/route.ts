import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { serviceInput } from "@/lib/validation/service";
import { createService, listServices } from "@/server/services/services";

export async function GET(): Promise<NextResponse> {
  const g = await guard();
  if ("response" in g) return g.response;
  try {
    return jsonOk({ items: await listServices() });
  } catch {
    return jsonError("Couldn't load services. Is the database connected?", 503, "DB_UNAVAILABLE");
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
  const parsed = serviceInput.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422);

  try {
    const item = await createService(parsed.data);
    await prisma.activityLog.create({
      data: {
        userId: g.user.sub,
        action: "CREATE",
        entityType: "Service",
        entityId: item.id,
        summary: `Created service "${item.title}"`,
      },
    });
    revalidateTag("services");
    revalidatePath("/");
    revalidatePath("/services");
    return jsonOk({ item }, 201);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return jsonError("A service with that slug already exists", 409);
    }
    throw err;
  }
}
