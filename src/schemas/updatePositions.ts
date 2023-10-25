import { z } from "zod";

export const updatePositionsSchema = z.object({
  listId: z.string().uuid(),
  items: z.array(
    z.object({
      id: z.string().uuid(),
      position: z.number(),
    }),
  ),
});
