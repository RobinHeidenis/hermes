import { z } from "zod";

export const updateListSchema = z.object({
  name: z.string().min(1),
  listId: z.string().uuid(),
});
