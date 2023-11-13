import { z } from "zod";
import { createLoyaltyCardSchema } from "~/schemas/createLoyaltyCard";

export const editLoyaltyCardSchema = createLoyaltyCardSchema.merge(
  z.object({
    loyaltyCardId: z.string().uuid(),
  }),
);
