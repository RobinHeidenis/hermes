import { z } from "zod";

export const setItemCheckedSchema = z.object({
  listId: z.string().uuid(),
  itemId: z.string().uuid(),
  checked: z.boolean(),
});
