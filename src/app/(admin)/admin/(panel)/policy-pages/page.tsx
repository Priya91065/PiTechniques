import type { JSX } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import PolicyPagesManager from "@/components/admin/policy/PolicyPagesManager";

export default async function PolicyPagesAdminPage(): Promise<JSX.Element> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return <PolicyPagesManager />;
}
