import { redirect } from "next/navigation";

/** Policy pages are now listed inside Pages (WordPress-style). */
export default function PolicyPagesAdminPage(): never {
  redirect("/admin/pages");
}
