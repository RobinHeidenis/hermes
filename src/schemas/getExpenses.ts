import { z } from "zod";
import { workspaceIdSchema } from "~/schemas/workspaceId";

const ONE_DAY = "1-day";
const THREE_DAYS = "3-days";
const FIVE_DAYS = "5-days";
const ONE_WEEK = "1-week";
const TWO_WEEKS = "2-weeks";
const ONE_MONTH = "1-month";
const THREE_MONTHS = "3-months";
const SIX_MONTHS = "6-months";
const ONE_YEAR = "1-year";

const periods = [
  ONE_DAY,
  THREE_DAYS,
  FIVE_DAYS,
  ONE_WEEK,
  TWO_WEEKS,
  ONE_MONTH,
  THREE_MONTHS,
  SIX_MONTHS,
  ONE_YEAR,
] as const;

export const getExpensesSchema = workspaceIdSchema.merge(
  z.object({
    period: z.enum(periods),
  }),
);
