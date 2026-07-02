import { redirect } from "next/navigation";

/** Homepage content is now managed inside Pages (WordPress-style). */
export default function HomepageAdminPage(): never {
  redirect("/admin/pages/home");
}
