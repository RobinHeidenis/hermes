import { z } from "zod";

export const getListSchema = z.object({
  listId: z.string().uuid(),
});
