import type { JSX } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { can } from "@/lib/auth/rbac";
import MessagesManager from "@/components/admin/contact/MessagesManager";

export default async function ContactAdminPage(): Promise<JSX.Element> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  return (
    <MessagesManager
      perms={{
        canCreate: can(user.role, "CREATE"),
        canEdit: can(user.role, "EDIT"),
        canDelete: can(user.role, "DELETE"),
      }}
    />
  );
}
