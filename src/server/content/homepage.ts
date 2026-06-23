import { unstable_cache } from "next/cache";
import { getPublishedData, type HomepageData } from "@/server/services/homepageStaging";

const cached = unstable_cache(
  async (): Promise<HomepageData | null> => {
    try {
      return await getPublishedData();
    } catch {
      return null;
    }
  },
  ["homepage-published"],
  { tags: ["homepage"], revalidate: 3600 },
);

/** The published homepage snapshot (banner + about + stats), or null pre-publish. */
export async function getPublishedHomepage(): Promise<HomepageData | null> {
  return cached();
}
