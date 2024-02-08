import { z } from "zod";

export const deleteExpenseSchema = z.object({
  expenseId: z.string(),
});
