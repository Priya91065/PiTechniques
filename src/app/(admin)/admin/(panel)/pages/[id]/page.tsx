import type { JSX } from "react";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { can } from "@/lib/auth/rbac";
import { getPage } from "@/server/services/pages";
import { listSections } from "@/server/services/sections";
import PageEditor, { type EditorPage, type EditorSection } from "@/components/admin/pages/PageEditor";

export default async function EditPageContent({ params }: { params: Promise<{ id: string }> }): Promise<JSX.Element> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  const { id } = await params;

  const page = await getPage(id);
  if (!page) notFound();
  const sections = await listSections(id);

  const editorPage: EditorPage = {
    id: page.id,
    title: page.title,
    slug: page.slug,
    status: page.status,
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
  };
  const editorSections: EditorSection[] = sections.map((s) => ({
    id: s.id,
    type: s.type,
    title: s.title,
    published: s.published,
    content: s.content,
    order: s.order,
  }));

  return (
    <PageEditor
      page={editorPage}
      initialSections={editorSections}
      perms={{
        canCreate: can(user.role, "CREATE"),
        canEdit: can(user.role, "EDIT"),
        canDelete: can(user.role, "DELETE"),
        canPublish: can(user.role, "PUBLISH"),
      }}
    />
  );
}
