import { redirect } from "next/navigation";

/** The banner is part of the Home page — managed inside Pages now. */
export default function BannerAdminPage(): never {
  redirect("/admin/pages/home");
}
