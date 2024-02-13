import { CustomAppShell } from "~/components/appshell/CustomAppShell";
import {
  ActionIcon,
  Affix,
  Button,
  SimpleGrid,
  Text,
  Title,
} from "@mantine/core";
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from "lucide-react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { openCreateExpenseModal } from "~/components/modals/CreateExpenseModal";
import { useCalculateExpenseTotals } from "~/hooks/useCalculateExpenseTotals";
import { OverviewCard } from "~/components/pages/expenses/OverviewCard";
import { useHotkeys } from "@mantine/hooks";
import { ExpenseCard } from "~/components/pages/expenses/ExpenseCard";
import type { AuthedProps } from "~/server/api/trpc";
import { requireAuthSSP as getServerSideProps } from "~/server/api/trpc";

export { getServerSideProps };

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

export const ExpensesPage = ({ user }: AuthedProps) => {
  const { query, replace } = useRouter();
  const page = parseInt((query.page as string) ?? "0");

  const { data } = api.expense.paginatedExpenses.useQuery(
    {
      workspaceId: query.workspace as string,
      offset: parseInt((query.page as string) ?? "0") * 50,
    },
    { enabled: !!query.workspace },
  );
  const { data: monthStats } = api.expense.monthStats.useQuery(
    { workspaceId: query.workspace as string },
    { enabled: !!query.workspace },
  );
  const groupedExpenses = useCalculateExpenseTotals(data?.expenses);

  useHotkeys([
    ["shift+N", openCreateExpenseModal],
    [
      "ctrl+ArrowRight",
      () => {
        if (data?.hasNextPage) {
          void replace(
            `/workspace/${query.workspace as string}/expenses?page=${page + 1}`,
            undefined,
            { shallow: true },
          );
        }
      },
    ],
    [
      "ctrl+ArrowLeft",
      () => {
        if (data?.hasPreviousPage) {
          void replace(
            `/workspace/${query.workspace as string}/expenses?page=${page - 1}`,
            undefined,
            { shallow: true },
          );
        }
      },
    ],
  ]);

  return (
    <CustomAppShell user={user}>
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
                  thisMonth={monthStats?.spentThisMonth}
                  previousMonth={monthStats?.spentPreviousMonth}
                  label={"Total spent"}
                  money
                />
                <OverviewCard
                  thisMonth={monthStats?.amountThisMonth}
                  previousMonth={monthStats?.amountPreviousMonth}
                  label={"Total expenses"}
                />
              </SimpleGrid>
            </div>
            <div className={"mt-3 w-full max-w-lg"}>
              {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
              {(data?.hasNextPage || data?.hasPreviousPage) &&
                (data?.expenses.length ?? 0) > 0 && (
                  <div
                    className={
                      "my-5 flex w-full items-center justify-between gap-x-10"
                    }
                  >
                    <Button
                      justify={"space-between"}
                      leftSection={<ChevronLeftIcon />}
                      className={"w-32"}
                      variant={"light"}
                      onClick={() => {
                        void replace(
                          `/workspace/${query.workspace as string}/expenses?page=${page - 1}`,
                          undefined,
                          { shallow: true },
                        );
                      }}
                      disabled={!data?.hasPreviousPage}
                    >
                      Previous
                    </Button>
                    <Button
                      justify={"space-between"}
                      rightSection={<ChevronRightIcon />}
                      className={"w-32"}
                      variant={"light"}
                      onClick={() => {
                        void replace(
                          `/workspace/${query.workspace as string}/expenses?page=${page + 1}`,
                          undefined,
                          { shallow: true },
                        );
                      }}
                      disabled={!data?.hasNextPage}
                    >
                      Next
                    </Button>
                  </div>
                )}
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
                    {timedExpenses?.map((i) => (
                      <ExpenseCard key={i.id} expense={i} />
                    ))}
                  </>
                );
              })}
            </div>
            <div className={"mb-20 mt-5 flex items-center gap-x-10"}>
              <Button
                justify={"space-between"}
                leftSection={<ChevronLeftIcon />}
                className={"w-32"}
                variant={"light"}
                onClick={() => {
                  void replace(
                    `/workspace/${query.workspace as string}/expenses?page=${page - 1}`,
                    undefined,
                    { shallow: true, scroll: true },
                  );
                }}
                disabled={!data?.hasPreviousPage}
              >
                Previous
              </Button>
              <Text>{page + 1}</Text>
              <Button
                justify={"space-between"}
                rightSection={<ChevronRightIcon />}
                className={"w-32"}
                variant={"light"}
                onClick={() => {
                  void replace(
                    `/workspace/${query.workspace as string}/expenses?page=${page + 1}`,
                    undefined,
                    { shallow: true, scroll: true },
                  );
                }}
                disabled={!data?.hasNextPage}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </CustomAppShell>
  );
};

export default ExpensesPage;
