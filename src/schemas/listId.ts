import { z } from "zod";

export const listIdSchema = z.object({
  listId: z.string().uuid(),
});
