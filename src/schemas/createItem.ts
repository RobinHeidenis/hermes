import { z } from "zod";

export const createItemSchema = z.object({
  listId: z.string().uuid(),
  name: z.string().min(2),
  quantity: z.string().optional().nullable(),
  price: z.coerce.number().finite().max(9999.99).optional().nullable(),
  url: z
    .union([
      z.string().min(4).url(),
      z.string().length(0).nullable().optional(),
    ])
    .optional()
    .transform((e) => (e === "" ? undefined : e)),
});
