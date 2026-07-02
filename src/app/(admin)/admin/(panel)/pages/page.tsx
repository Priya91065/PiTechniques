import type { JSX } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { can } from "@/lib/auth/rbac";
import { ensureSystemPages } from "@/server/services/pages";
import PagesManager from "@/components/admin/pages/PagesManager";

export default async function PagesAdminPage(): Promise<JSX.Element> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  // WordPress-style: the fixed site pages always appear in this list.
  try {
    await ensureSystemPages();
  } catch {
    /* DB unavailable — the list will simply show what the API returns */
  }

  return (
    <PagesManager
      perms={{
        canCreate: can(user.role, "CREATE"),
        canEdit: can(user.role, "EDIT"),
        canDelete: can(user.role, "DELETE"),
        canPublish: can(user.role, "PUBLISH"),
      }}
    />
  );
}
