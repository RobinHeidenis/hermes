import { z } from "zod";

export const updateListSchema = z.object({
  name: z.string().min(1),
  defaultLoyaltyCardId: z.string().uuid().nullable(),
  listId: z.string().uuid(),
});
