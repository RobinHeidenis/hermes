import { z } from "zod";
import { workspaceIdSchema } from "~/schemas/workspaceId";

export const createLoyaltyCardSchema = workspaceIdSchema.merge(
  z.object({
    name: z.string().min(1).max(25),
    store: z.string().min(1).max(40),
    barcode: z.string().min(1),
    isQR: z.boolean(),
  }),
);
