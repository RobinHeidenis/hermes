import { workspaceIdSchema } from "~/schemas/workspaceId";
import { z } from "zod";
import { categoryEnum } from "~/server/db/schema";

export const createExpenseSchema = workspaceIdSchema.merge(
  z.object({
    name: z.string().min(2).max(50),
    price: z.coerce.number().finite().max(999999.99),
    category: z.enum(categoryEnum.enumValues),
  }),
);
