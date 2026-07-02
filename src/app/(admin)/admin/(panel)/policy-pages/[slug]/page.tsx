import { redirect } from "next/navigation";

/** Policy pages are now edited inside Pages (WordPress-style). */
export default async function PolicyPageEditPage({ params }: { params: Promise<{ slug: string }> }): Promise<never> {
  const { slug } = await params;
  redirect(`/admin/pages/${slug}`);
}
