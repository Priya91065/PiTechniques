import type { JSX, ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import AdminShell from "@/components/admin/AdminShell";

/**
 * Layout for the authenticated admin panel. Guards every panel route (the
 * middleware also guards, this is defence-in-depth + provides the user to the
 * shell) and renders the sidebar/header chrome around the page.
 */
export default async function PanelLayout({ children }: { children: ReactNode }): Promise<JSX.Element> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  return (
    <AdminShell user={{ name: user.name, email: user.email, role: user.role }}>{children}</AdminShell>
  );
}
