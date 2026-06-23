import { revalidatePath, revalidateTag } from "next/cache";

/** Purge caches for every surface that renders case-study content. */
export function revalidateCaseStudies(): void {
  revalidateTag("case-studies");
  revalidatePath("/");
  revalidatePath("/case-studies");
  revalidatePath("/detailed-project");
}
