import {
  Badge,
  Button,
  Loader,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { type categoryEnum, categoryToIconMap } from "~/server/db/schema";
import { CalendarIcon, PencilIcon, TagIcon, Trash2Icon } from "lucide-react";
import dayjs from "dayjs";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { openEditExpenseModal } from "~/components/modals/EditExpenseModal";

interface ExpenseModalProps {
  id: string;
  name: string;
  price: string;
  category: (typeof categoryEnum.enumValues)[number];
  monthly: boolean;
  createdAt: Date;
}

export const ExpenseModal = ({
  id,
  name,
  price,
  category,
  monthly,
  createdAt,
}: ExpenseModalProps) => {
  const { Icon, color } = categoryToIconMap[category];
  const utils = api.useUtils();
  const { query } = useRouter();
  const { mutate, isLoading } = api.expense.deleteExpense.useMutation({
    onSuccess: () => {
      void utils.expense.getLast50Expenses.invalidate({
        workspaceId: query.workspace as string,
      });
      modals.closeAll();
    },
  });

  return (
    <div className={"flex flex-col"}>
      <div className={"flex flex-row items-center justify-between"}>
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
              {name}
            </Text>
            <div className={"flex items-center"}>
              <Text c={"dimmed"}>
                {createdAt
                  ? monthly
                    ? dayjs(createdAt).format("MMMM")
                    : dayjs(createdAt).format("DD/MM/YYYY")
                  : "Unknown"}
              </Text>
            </div>
          </div>
        </div>
        <div>
          <div className={"flex items-center"}>
            <Text size={"lg"} fw={700}>
              {Intl.NumberFormat("nl-NL", {
                style: "currency",
                currency: "EUR",
              }).format(parseFloat(price ?? "0"))}
            </Text>
          </div>
        </div>
      </div>
      <div className={"mt-3 flex items-center gap-x-2"}>
        <Tooltip label={"This expense is for a whole month"} color={"gray"}>
          <Badge
            color={"lime"}
            variant={"light"}
            leftSection={<CalendarIcon className={"h-3 w-3"} />}
          >
            Monthly
          </Badge>
        </Tooltip>
        <Badge
          color={color}
          variant={"light"}
          leftSection={<TagIcon className={"h-3 w-3"} />}
        >
          {category}
        </Badge>
      </div>
      <div className={"mt-6"}>
        <Title order={6} fw={500} c={"dimmed"}>
          Actions
        </Title>
        <Button
          onClick={() =>
            openEditExpenseModal({
              expense: {
                id,
                name,
                price,
                category,
                monthly,
                createdAt,
                workspaceId: query.workspace as string,
              },
            })
          }
          variant={"light"}
          className={"mb-3 mt-1 w-full"}
          leftSection={<PencilIcon className={"h-4 w-4"} />}
        >
          Edit
        </Button>
        <Button
          onClick={() =>
            modals.openConfirmModal({
              title: "Delete expense?",
              children: "Are you sure you want to delete this expense?",
              confirmProps: {
                color: "red",
                title: "Delete",
                leftSection: isLoading ? (
                  <Loader color={"white"} size={"xs"} />
                ) : (
                  <Trash2Icon className={"h-4 w-4"} />
                ),
              },
              onConfirm: () => mutate({ expenseId: id }),
              labels: {
                confirm: "Delete",
                cancel: "Cancel",
              },
            })
          }
          bg={"dark.5"}
          c="gray.3"
          className={"w-full"}
          leftSection={<Trash2Icon className={"h-4 w-4"} />}
        >
          Delete expense
        </Button>
      </div>
    </div>
  );
};

export const openExpenseModal = (props: ExpenseModalProps) => {
  modals.open({
    title: "View expense",
    children: <ExpenseModal {...props} />,
  });
};
