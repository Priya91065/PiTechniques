import type { Faq } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { FaqInput } from "@/lib/validation/faq";

function nz(v: string | null | undefined): string | null {
  const t = (v ?? "").trim();
  return t.length > 0 ? t : null;
}

export function listFaqs(): Promise<Faq[]> {
  return prisma.faq.findMany({ orderBy: { order: "asc" } });
}

export async function createFaq(data: FaqInput): Promise<Faq> {
  const max = await prisma.faq.aggregate({ _max: { order: true } });
  return prisma.faq.create({
    data: {
      question: data.question,
      answer: data.answer,
      category: nz(data.category),
      published: data.published ?? true,
      order: (max._max.order ?? -1) + 1,
    },
  });
}

export function updateFaq(id: string, data: Partial<FaqInput>): Promise<Faq> {
  return prisma.faq.update({
    where: { id },
    data: {
      ...(data.question !== undefined ? { question: data.question } : {}),
      ...(data.answer !== undefined ? { answer: data.answer } : {}),
      ...(data.category !== undefined ? { category: nz(data.category) } : {}),
      ...(data.published !== undefined ? { published: data.published } : {}),
    },
  });
}

export function deleteFaq(id: string): Promise<Faq> {
  return prisma.faq.delete({ where: { id } });
}

export async function reorderFaqs(ids: string[]): Promise<void> {
  await prisma.$transaction(
    ids.map((id, index) => prisma.faq.update({ where: { id }, data: { order: index } })),
  );
}
