import type { JSX, ReactNode } from "react";
import AdminProviders from "@/components/admin/AdminProviders";

/**
 * Admin route-group layout. Wraps admin routes in the MUI provider stack
 * (a Client Component), fully isolated from the public faithful site which uses
 * the original CSS. The full dashboard shell (sidebar, header, dark/light)
 * arrives in Phase 4.
 */
export default function AdminLayout({ children }: { children: ReactNode }): JSX.Element {
  return <AdminProviders>{children}</AdminProviders>;
}
