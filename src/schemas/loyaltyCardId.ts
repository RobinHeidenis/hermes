import { z } from "zod";

export const loyaltyCardIdSchema = z.object({
  loyaltyCardId: z.string().uuid(),
});
