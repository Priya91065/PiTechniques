import type { JSX } from "react";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { can } from "@/lib/auth/rbac";
import PolicyPageEditor from "@/components/admin/policy/PolicyPageEditor";
import { POLICY_SLUGS } from "@/constants/policyPagesHtml";

export default async function PolicyPageEditPage({ params }: { params: Promise<{ slug: string }> }): Promise<JSX.Element> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  const { slug } = await params;
  if (!(POLICY_SLUGS as readonly string[]).includes(slug)) notFound();

  return (
    <PolicyPageEditor
      slug={slug}
      perms={{
        canCreate: can(user.role, "CREATE"),
        canEdit: can(user.role, "EDIT"),
        canDelete: can(user.role, "DELETE"),
        canPublish: can(user.role, "PUBLISH"),
      }}
    />
  );
}
