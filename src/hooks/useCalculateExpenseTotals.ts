import groupBy from "object.groupby";
import dayjs from "dayjs";
import type { RouterOutputs } from "~/utils/api";

const groupByDate = ({ createdAt }: { createdAt: Date }) => {
  const date = dayjs(createdAt);
  const startOfMonth = dayjs().startOf("month");

  if (date.isAfter(dayjs().add(1, "day"), "day")) return "Coming up";
  if (date.isSame(dayjs(), "day")) return "Today";
  if (
    date.isAfter(startOfMonth) &&
    date.isSame(dayjs().subtract(1, "day"), "day")
  )
    return "Yesterday";
  if (
    date.isAfter(startOfMonth) &&
    date.isAfter(dayjs().subtract(1, "week"), "week")
  )
    return "Earlier this week";
  if (
    date.isAfter(startOfMonth) &&
    date.isAfter(dayjs().subtract(2, "weeks"), "week")
  )
    return "Last week";
  if (
    date.isAfter(startOfMonth.subtract(1, "month")) &&
    date.isBefore(startOfMonth)
  )
    return "Last month";
  else return "Older";
};

type ExpenseItem = RouterOutputs["expense"]["getLast50Expenses"][number];

type GroupedByDate = {
  "Coming up": ExpenseItem[];
  Today: ExpenseItem[];
  Yesterday: ExpenseItem[];
  "Earlier this week": ExpenseItem[];
  "Last week": ExpenseItem[];
  "Last month": ExpenseItem[];
  Older: ExpenseItem[];
};

export const useCalculateExpenseTotals = (
  expenses: RouterOutputs["expense"]["getLast50Expenses"] | undefined,
) => {
  const groupedExpenses: Partial<GroupedByDate> = expenses
    ? (groupBy(expenses, groupByDate) as Partial<GroupedByDate>)
    : {};
  const expensesInThisMonth = expenses?.filter((expense) =>
    dayjs(expense.createdAt).isAfter(dayjs().startOf("month")),
  );
  const totalSpentThisMonth = expensesInThisMonth?.reduce(
    (prev, curr) => prev + Number(curr.price),
    0,
  );
  const totalSpentInPreviousMonth =
    groupedExpenses["Last month"]?.reduce(
      (prev, curr) => prev + Number(curr.price),
      0,
    ) ?? 0;

  return {
    groupedExpenses,
    expensesInThisMonth,
    totalSpentThisMonth,
    totalSpentInPreviousMonth,
  };
};
