import { NextResponse, type NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { faqInput } from "@/lib/validation/faq";
import { createFaq, listFaqs } from "@/server/services/faqs";

export async function GET(): Promise<NextResponse> {
  const g = await guard();
  if ("response" in g) return g.response;
  try {
    return jsonOk({ items: await listFaqs() });
  } catch {
    return jsonError("Couldn't load FAQs. Is the database connected?", 503, "DB_UNAVAILABLE");
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
  const parsed = faqInput.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422);

  const item = await createFaq(parsed.data);
  await prisma.activityLog.create({
    data: {
      userId: g.user.sub,
      action: "CREATE",
      entityType: "Faq",
      entityId: item.id,
      summary: `Created FAQ "${item.question}"`,
    },
  });

  revalidateTag("faqs");
  return jsonOk({ item }, 201);
}
