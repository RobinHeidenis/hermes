import { z } from "zod";

export const deleteItemSchema = z.object({
  listId: z.string().uuid(),
  itemId: z.string().uuid(),
});
