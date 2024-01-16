import { CustomAppShell } from "~/components/appshell/CustomAppShell";
import {
  Badge,
  Button,
  Card,
  SimpleGrid,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  CakeIcon,
  GemIcon,
  HomeIcon,
  PlusIcon,
  StoreIcon,
  TagIcon,
} from "lucide-react";
import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import groupBy from "object.groupby";
import { openCreateExpenseModal } from "~/components/modals/CreateExpenseModal";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

dayjs.extend(relativeTime);

type Period =
  | "1-day"
  | "3-days"
  | "5-days"
  | "1-week"
  | "2-weeks"
  | "1-month"
  | "3-months"
  | "6-months"
  | "1-year";

const categoryMap = {
  groceries: { Icon: StoreIcon, color: "blue" },
  snacks: { Icon: CakeIcon, color: "orange" },
  household: { Icon: HomeIcon, color: "green" },
  other: { Icon: GemIcon, color: "red" },
};

const groupByDate = ({ createdAt }: { createdAt: Date }) => {
  const date = dayjs(createdAt);
  if (date.isSame(dayjs(), "day")) return "Today";
  if (date.isSame(dayjs().subtract(1, "day"), "day")) return "Yesterday";
  if (date.isAfter(dayjs().subtract(1, "week"), "week")) return "This week";
  if (date.isAfter(dayjs().subtract(2, "weeks"), "week")) return "Last week";
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

export const ExpensesPage = withPageAuthRequired(() => {
  const { query } = useRouter();
  const { data: expenses } = api.expense.getLast50Expenses.useQuery({
    workspaceId: query.workspace as string,
  });
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

  return (
    <CustomAppShell>
      <div className={"flex items-center justify-between"}>
        <div>
          <Text
            c={"dimmed"}
            mt={{
              base: 11,
              md: 0,
            }}
            style={{ viewTransitionName: `workspace-header` }}
          >
            Expenses
          </Text>
          <Title
            visibleFrom={"sm"}
            style={{
              viewTransitionName: `expenses-page-title`,
            }}
          >
            Your workspace expenses
          </Title>
        </div>
        <div className={"flex self-start"}>
          <Button
            variant={"light"}
            onClick={openCreateExpenseModal}
            leftSection={<PlusIcon className={"h-5 w-5"} />}
          >
            New expense
          </Button>
        </div>
      </div>
      <Title
        style={{
          viewTransitionName: `expenses-page-title`,
        }}
        className={"mt-1"}
        hiddenFrom={"sm"}
      >
        Your expenses
      </Title>
      <Title order={4} className={"mt-3"}>
        Overview for this month
      </Title>
      <SimpleGrid cols={2}>
        <Card shadow={"lg"}>
          <Title order={6}>Total spent</Title>
          <Title order={2}>
            €
            {}
          </Title>
          <Text>
            {}
          </Text>
        </Card>
        <Card shadow={"lg"}>
          <Title order={6}>Expenses</Title>
          <Title order={2}>{expensesInThisMonth?.length ?? 0}</Title>
        </Card>
      </SimpleGrid>
      <div className={"mt-3"}>
        <Title order={4}>Expenses</Title>
        {Object.keys(groupedExpenses)?.map((date) => {
          const timedExpenses =
            groupedExpenses[date as keyof typeof groupedExpenses];
          return (
            <>
              <Text c={"dimmed"}>{date}</Text>
              {timedExpenses?.map((i) => {
                const { color, Icon } = categoryMap[i.category];

                return (
                  <Card key={i.id} radius={"md"} className={"mb-3 max-w-lg"}>
                    <div
                      className={"flex flex-row items-center justify-between"}
                    >
                      <div className={"flex items-center"}>
                        <ThemeIcon
                          variant={"light"}
                          className={"mr-3"}
                          size={"xl"}
                          color={color}
                        >
                          <Icon />
                        </ThemeIcon>
                        <div>
                          <Text size={"md"} fw={700}>
                            {i.name}
                          </Text>
                          <div className={"flex items-center"}>
                            <Text c={"dimmed"}>
                              {i.createdAt?.toLocaleDateString()}
                            </Text>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className={"flex items-center"}>
                          <Badge
                            visibleFrom={"md"}
                            color={color}
                            variant={"light"}
                            className={"mr-5"}
                            leftSection={<TagIcon className={"h-3 w-3"} />}
                          >
                            {i.category}
                          </Badge>
                          <Text size={"lg"} fw={700}>
                            €{i.price}
                          </Text>
                        </div>
                      </div>
                    </div>
                    <Badge
                      hiddenFrom={"md"}
                      color={color}
                      variant={"light"}
                      className={"mt-2"}
                      leftSection={<TagIcon className={"h-3 w-3"} />}
                    >
                      {i.category}
                    </Badge>
                  </Card>
                );
              })}
            </>
          );
        })}
      </div>
    </CustomAppShell>
  );
});

export default ExpensesPage;
