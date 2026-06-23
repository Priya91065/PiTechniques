import type { ContactStatus, ContactSubmission, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { ContactSubmissionInput } from "@/lib/validation/contact";

function nz(v: string | null | undefined): string | null {
  const t = (v ?? "").trim();
  return t.length > 0 ? t : null;
}

export interface CreateMeta {
  ipAddress?: string | null;
  userAgent?: string | null;
}

export function createSubmission(data: ContactSubmissionInput, meta: CreateMeta = {}): Promise<ContactSubmission> {
  return prisma.contactSubmission.create({
    data: {
      source: data.source,
      firstName: data.firstName,
      lastName: nz(data.lastName),
      email: data.email,
      phone: nz(data.phone),
      message: nz(data.message),
      position: nz(data.position),
      resumeUrl: nz(data.resumeUrl),
      ipAddress: nz(meta.ipAddress),
      userAgent: nz(meta.userAgent),
    },
  });
}

export interface ListParams {
  status?: ContactStatus;
  source?: "CONTACT" | "CAREER";
  search?: string;
  skip?: number;
  take?: number;
}

export interface ListResult {
  items: ContactSubmission[];
  total: number;
  unread: number;
}

export async function listSubmissions(params: ListParams = {}): Promise<ListResult> {
  const { status, source, search, skip = 0, take = 25 } = params;
  const where: Prisma.ContactSubmissionWhereInput = {
    ...(status ? { status } : {}),
    ...(source ? { source } : {}),
    ...(search
      ? {
          OR: [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { message: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };
  const [items, total, unread] = await prisma.$transaction([
    prisma.contactSubmission.findMany({ where, orderBy: { createdAt: "desc" }, skip, take }),
    prisma.contactSubmission.count({ where }),
    prisma.contactSubmission.count({ where: { status: "UNREAD" } }),
  ]);
  return { items, total, unread };
}

export function getSubmission(id: string): Promise<ContactSubmission | null> {
  return prisma.contactSubmission.findUnique({ where: { id } });
}

export function setSubmissionStatus(id: string, status: ContactStatus): Promise<ContactSubmission> {
  return prisma.contactSubmission.update({ where: { id }, data: { status } });
}

export function deleteSubmission(id: string): Promise<ContactSubmission> {
  return prisma.contactSubmission.delete({ where: { id } });
}
