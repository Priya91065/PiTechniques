import { z } from "zod";

/** Shared reorder payload: an ordered array of entity ids. */
export const reorderInput = z.object({
  ids: z.array(z.string().min(1)).min(1),
});
