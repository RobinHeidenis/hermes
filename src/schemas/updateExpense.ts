import { z } from "zod";
import { createExpenseSchema } from "~/schemas/createExpense";

export const updateExpenseSchema = createExpenseSchema.merge(
  z.object({
    id: z.string(),
  }),
);
