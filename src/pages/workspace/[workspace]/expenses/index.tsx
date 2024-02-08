import { CustomAppShell } from "~/components/appshell/CustomAppShell";
import {
  ActionIcon,
  Affix,
  Badge,
  Button,
  Card,
  SimpleGrid,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  ArmchairIcon,
  BriefcaseIcon,
  CakeIcon,
  CarIcon,
  CoinsIcon,
  HomeIcon,
  PawPrintIcon,
  PlusIcon,
  StoreIcon,
  TagIcon,
  WalletIcon,
} from "lucide-react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { openCreateExpenseModal } from "~/components/modals/CreateExpenseModal";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { useCalculateExpenseTotals } from "~/hooks/useCalculateExpenseTotals";
import { OverviewCard } from "~/components/pages/expenses/OverviewCard";

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
  household: { Icon: HomeIcon, color: "green" },
  snacks: { Icon: CakeIcon, color: "orange" },
  leisure: { Icon: ArmchairIcon, color: "violet" },
  fixed: { Icon: WalletIcon, color: "indigo" },
  transport: { Icon: CarIcon, color: "cyan" },
  professional: { Icon: BriefcaseIcon, color: "teal" },
  pets: { Icon: PawPrintIcon, color: "yellow" },
  other: { Icon: CoinsIcon, color: "red" },
};

export const ExpensesPage = withPageAuthRequired(() => {
  const { query } = useRouter();
  const { data: expenses } = api.expense.getLast50Expenses.useQuery(
    {
      workspaceId: query.workspace as string,
    },
    { enabled: !!query.workspace },
  );
  const {
    totalSpentThisMonth,
    totalSpentInPreviousMonth,
    groupedExpenses,
    expensesInThisMonth,
  } = useCalculateExpenseTotals(expenses);

  return (
    <CustomAppShell>
      <Affix position={{ bottom: 20, right: 20 }}>
        <ActionIcon size="xl" radius={"xl"} onClick={openCreateExpenseModal}>
          <PlusIcon />
        </ActionIcon>
      </Affix>
      <div
        className={"flex w-full items-center justify-between sm:justify-center"}
      >
        <div
          className={
            "w-full max-w-2xl justify-center sm:w-2/3 md:w-1/2 3xl:w-1/4"
          }
        >
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
            <div className={"flex justify-between"}>
              <Title
                visibleFrom={"sm"}
                style={{
                  viewTransitionName: `expenses-page-title`,
                }}
              >
                Your workspace expenses
              </Title>
              <Button
                variant={"light"}
                onClick={openCreateExpenseModal}
                visibleFrom={"xl"}
                leftSection={<PlusIcon className={"h-5 w-5"} />}
              >
                New expense
              </Button>
            </div>
          </div>
          <div className={"flex flex-col items-center"}>
            <div className={"w-full max-w-lg"}>
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
              <SimpleGrid cols={2} className={"mt-2 w-full max-w-lg"}>
                <OverviewCard
                  thisMonth={totalSpentThisMonth}
                  previousMonth={totalSpentInPreviousMonth}
                  label={"Total spent"}
                  money
                />
                <OverviewCard
                  thisMonth={expensesInThisMonth?.length}
                  previousMonth={0}
                  label={"Total expenses"}
                />
              </SimpleGrid>
            </div>
            <div className={"mt-3 w-full max-w-lg"}>
              <Title order={4}>Expenses</Title>
              {Object.keys(groupedExpenses).length === 0 && (
                <Text c={"dimmed"}>No expenses yet</Text>
              )}
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
                          className={"mb-3 w-full max-w-lg"}
                        >
                          <div
                            className={
                              "flex flex-row items-center justify-between"
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
                                    {i.createdAt
                                      ? i.monthly
                                        ? dayjs(i.createdAt).format("MMMM")
                                        : dayjs(i.createdAt).format(
                                            "DD/MM/YYYY",
                                          )
                                      : "Unknown"}
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
                                  leftSection={
                                    <TagIcon className={"h-3 w-3"} />
                                  }
                                >
                                  {i.category}
                                </Badge>
                                <Text size={"lg"} fw={700}>
                                  {Intl.NumberFormat("nl-NL", {
                                    style: "currency",
                                    currency: "EUR",
                                  }).format(parseFloat(i.price ?? "0"))}
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
          </div>
        </div>
      </div>
    </CustomAppShell>
  );
});

export default ExpensesPage;
