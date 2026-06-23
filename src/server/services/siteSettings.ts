import type { SiteSetting } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { SiteSettingsInput } from "@/lib/validation/siteSettings";

function nz(v: string | null | undefined): string | null {
  const t = (v ?? "").trim();
  return t.length > 0 ? t : null;
}

/** The single settings row (id = 1), or null if not yet created. */
export function getSiteSetting(): Promise<SiteSetting | null> {
  return prisma.siteSetting.findUnique({ where: { id: 1 } });
}

/** Create-or-update the singleton settings row. */
export function upsertSiteSetting(data: SiteSettingsInput): Promise<SiteSetting> {
  const values = {
    companyEmail: data.companyEmail,
    companyPhone: data.companyPhone,
    addressLines: data.addressLines,
    linkedinUrl: nz(data.linkedinUrl),
    footerNote: nz(data.footerNote),
  };
  return prisma.siteSetting.upsert({
    where: { id: 1 },
    update: values,
    create: { id: 1, ...values },
  });
}
