import type { Testimonial } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { TestimonialInput } from "@/lib/validation/testimonial";

/** Admin: all testimonials (published + drafts) in display order. */
export function listTestimonials(): Promise<Testimonial[]> {
  return prisma.testimonial.findMany({ orderBy: { order: "asc" } });
}

export async function createTestimonial(data: TestimonialInput): Promise<Testimonial> {
  const max = await prisma.testimonial.aggregate({ _max: { order: true } });
  return prisma.testimonial.create({
    data: {
      quote: data.quote,
      company: data.company,
      authorName: data.authorName,
      designation: data.designation,
      photo: data.photo ?? null,
      published: data.published ?? true,
      order: (max._max.order ?? -1) + 1,
    },
  });
}

export function updateTestimonial(id: string, data: Partial<TestimonialInput>): Promise<Testimonial> {
  return prisma.testimonial.update({
    where: { id },
    data: {
      ...(data.quote !== undefined ? { quote: data.quote } : {}),
      ...(data.company !== undefined ? { company: data.company } : {}),
      ...(data.authorName !== undefined ? { authorName: data.authorName } : {}),
      ...(data.designation !== undefined ? { designation: data.designation } : {}),
      ...(data.photo !== undefined ? { photo: data.photo ?? null } : {}),
      ...(data.published !== undefined ? { published: data.published } : {}),
    },
  });
}

export function deleteTestimonial(id: string): Promise<Testimonial> {
  return prisma.testimonial.delete({ where: { id } });
}

export async function reorderTestimonials(ids: string[]): Promise<void> {
  await prisma.$transaction(
    ids.map((id, index) => prisma.testimonial.update({ where: { id }, data: { order: index } })),
  );
}
