import { CustomAppShell } from "~/components/appshell/CustomAppShell";
import { Badge, Button, Card, Text, ThemeIcon, Title } from "@mantine/core";
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

export const ExpensesPage = () => {
  const { query } = useRouter();
  const { data: expenses } = api.expense.getLast50Expenses.useQuery({
    workspaceId: query.workspace as string,
  });
  const groupedExpenses: Partial<GroupedByDate> = expenses
    ? (groupBy(expenses, groupByDate) as Partial<GroupedByDate>)
    : {};

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
      <div>
        {Object.keys(groupedExpenses)?.map((date) => {
          const timedExpenses =
            groupedExpenses[date as keyof typeof groupedExpenses];
          return (
            <>
              <Text c={"dimmed"}>{date}</Text>
              {timedExpenses?.map((i) => {
                const { color, Icon } = categoryMap[i.category];

                return (
                  <Card
                    key={i.id}
                    radius={"md"}
                    className={
                      "mb-3 flex max-w-lg flex-row items-center justify-between"
                    }
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
                  </Card>
                );
              })}
            </>
          );
        })}
      </div>
    </CustomAppShell>
  );
};

export default ExpensesPage;
