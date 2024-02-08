import groupBy from "object.groupby";
import dayjs from "dayjs";
import type { RouterOutputs } from "~/utils/api";

const groupByDate = ({ createdAt }: { createdAt: Date }) => {
  const date = dayjs(createdAt);
  if (date.isAfter(dayjs().add(1, "day"), "day")) return "Coming up";
  if (date.isSame(dayjs(), "day")) return "Today";
  if (date.isSame(dayjs().subtract(1, "day"), "day")) return "Yesterday";
  if (date.isAfter(dayjs().subtract(1, "week"), "week"))
    return "Earlier this week";
  if (date.isAfter(dayjs().subtract(2, "weeks"), "week")) return "Last week";
  if (
    date.isAfter(dayjs().startOf("month").subtract(1, "month")) &&
    date.isBefore(dayjs().startOf("month"))
  )
    return "Last month";
  else return "Older";
};

type ExpenseItem = RouterOutputs["expense"]["getLast50Expenses"][number];

type GroupedByDate = {
  Today: ExpenseItem[];
  Yesterday: ExpenseItem[];
  "This week": ExpenseItem[];
  "Last week": ExpenseItem[];
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
  const expensesInPreviousMonth = expenses?.filter((expense) => {
    const date = dayjs(expense.createdAt);
    return (
      date.isAfter(dayjs().subtract(2, "months").startOf("month")) &&
      date.isBefore(dayjs().startOf("month"))
    );
  });
  const totalSpentInPreviousMonth = expensesInPreviousMonth?.reduce(
    (prev, curr) => prev + Number(curr.price),
    0,
  );

  return {
    groupedExpenses,
    expensesInThisMonth,
    totalSpentThisMonth,
    totalSpentInPreviousMonth,
  };
};
