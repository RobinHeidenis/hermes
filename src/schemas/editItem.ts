import { z } from "zod";

export const editItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2),
  quantity: z.string().nullable().optional(),
  price: z.coerce.number().nullable().optional(),
  url: z
    .union([
      z.string().min(4).url(),
      z.string().length(0).nullable().optional(),
    ])
    .transform((e) => (e === "" ? undefined : e)),
});
