import { redirect } from "next/navigation";

/** Contact page content is now managed inside Pages (WordPress-style). */
export default function ContactPageAdminPage(): never {
  redirect("/admin/pages/contact-us");
}
