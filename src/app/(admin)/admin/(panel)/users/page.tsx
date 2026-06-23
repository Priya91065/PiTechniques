import type { JSX } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canManageUsers } from "@/lib/auth/rbac";
import UsersManager from "@/components/admin/users/UsersManager";

export default async function UsersAdminPage(): Promise<JSX.Element> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!canManageUsers(user.role)) redirect("/admin");

  return <UsersManager currentUserId={user.sub} />;
}
