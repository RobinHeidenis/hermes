import { openExpenseModal } from "~/components/modals/ExpenseModal";
import { Badge, Card, Text, ThemeIcon } from "@mantine/core";
import { TagIcon } from "lucide-react";
import { categoryToIconMap, type receipts } from "~/server/db/schema";
import dayjs from "dayjs";

interface ExpenseCardProps {
  expense: typeof receipts.$inferSelect;
}

const useFormatDate = () => {
  return (rawDate: Date, monthly: boolean) => {
    const date = dayjs(rawDate);

    if (monthly) {
      return date.isBefore(dayjs().startOf("year"))
        ? date.format("MMMM YYYY")
        : date.format("MMMM");
    }

    return date.format("DD/MM/YYYY");
  };
};

export const ExpenseCard = ({ expense }: ExpenseCardProps) => {
  const formatDate = useFormatDate();
  const { color, Icon } = categoryToIconMap[expense.category];

  return (
    <Card
      key={expense.id}
      onClick={() => openExpenseModal(expense)}
      radius={"md"}
      className={
        "mb-3 w-full max-w-lg cursor-pointer hover:bg-[--mantine-color-default-hover]"
      }
    >
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
              {expense.name}
            </Text>
            <div className={"flex items-center"}>
              <Text c={"dimmed"}>
                {expense.createdAt
                  ? formatDate(expense.createdAt, expense.monthly ?? false)
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
              leftSection={<TagIcon className={"h-3 w-3"} />}
            >
              {expense.category}
            </Badge>
            <Text size={"lg"} fw={700}>
              {Intl.NumberFormat("nl-NL", {
                style: "currency",
                currency: "EUR",
              }).format(parseFloat(expense.price ?? "0"))}
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
        {expense.category}
      </Badge>
    </Card>
  );
};
