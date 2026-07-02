import { redirect } from "next/navigation";

/** About page content is now managed inside Pages (WordPress-style). */
export default function AboutAdminPage(): never {
  redirect("/admin/pages/about");
}
