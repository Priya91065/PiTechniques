import { NextResponse, type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { hashPassword } from "@/lib/auth/password";
import { createUserInput } from "@/lib/validation/user";
import { createUser, listUsers } from "@/server/services/users";

export async function GET(): Promise<NextResponse> {
  const g = await guard();
  if ("response" in g) return g.response;
  if (g.user.role !== "SUPER_ADMIN") return jsonError("Only a Super Admin can manage users", 403);
  try {
    return jsonOk({ items: await listUsers() });
  } catch {
    return jsonError("Couldn't load users. Is the database connected?", 503, "DB_UNAVAILABLE");
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const g = await guard();
  if ("response" in g) return g.response;
  if (g.user.role !== "SUPER_ADMIN") return jsonError("Only a Super Admin can manage users", 403);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }
  const parsed = createUserInput.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422);

  try {
    const passwordHash = await hashPassword(parsed.data.password);
    const item = await createUser(parsed.data, passwordHash);
    await prisma.activityLog.create({
      data: {
        userId: g.user.sub,
        action: "CREATE",
        entityType: "User",
        entityId: item.id,
        summary: `Created user "${item.email}" (${item.role})`,
      },
    });
    return jsonOk({ item }, 201);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return jsonError("A user with that email already exists", 409);
    }
    return jsonError("Couldn't create user", 500);
  }
}
