import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { modals } from "@mantine/modals";
import { useForm, zodResolver } from "@mantine/form";
import type { receipts } from "~/server/db/schema";
import {
  Button,
  Loader,
  NumberInput,
  Select,
  Switch,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { DateInput, MonthPickerInput } from "@mantine/dates";
import { CheckIcon, HelpCircleIcon } from "lucide-react";
import { selectInputData } from "./CreateExpenseModal";
import { updateExpenseSchema } from "~/schemas/updateExpense";

interface EditExpenseModalProps {
  expense: typeof receipts.$inferSelect;
}

const EditExpenseModal = ({ expense }: EditExpenseModalProps) => {
  const { query } = useRouter();
  const utils = api.useUtils();
  const { mutate, isLoading } = api.expense.updateExpense.useMutation({
    onSuccess: () => {
      void utils.expense.getLast50Expenses.invalidate({
        workspaceId: query.workspace as string,
      });
      modals.closeAll();
    },
  });
  const form = useForm({
    initialValues: {
      id: expense.id,
      workspaceId: expense.workspaceId,
      name: expense.name ?? "",
      price: parseFloat(expense.price),
      category: expense.category,
      monthly: expense.monthly,
      date: expense.createdAt,
    },
    validate: zodResolver(updateExpenseSchema),
  });

  return (
    <form
      className={"flex flex-col gap-y-3"}
      onSubmit={form.onSubmit((values) => mutate(values))}
    >
      <div className={"flex"}>
        <TextInput
          label={"Name"}
          className={"mr-5 w-4/6"}
          withAsterisk
          data-autofocus
          placeholder={"Milk"}
          {...form.getInputProps("name")}
        />
        <NumberInput
          label={"Price"}
          placeholder={"5.99"}
          className={"w-2/6"}
          decimalScale={2}
          fixedDecimalScale
          required
          {...form.getInputProps("price")}
        />
      </div>
      <Select
        label={"Category"}
        placeholder={"Groceries"}
        required
        data={selectInputData}
        searchable
        allowDeselect={false}
        {...form.getInputProps("category")}
      />
      {form.values.monthly ? (
        <MonthPickerInput label={"Month"} {...form.getInputProps("date")} />
      ) : (
        <DateInput label={"Date"} {...form.getInputProps("date")} />
      )}
      <Switch
        label={
          <Text className={"inline-flex items-center gap-x-2"}>
            Monthly
            <Tooltip label={"If this expense is for a whole month or not"}>
              <HelpCircleIcon className={"mb-1 h-4 w-4"} />
            </Tooltip>
          </Text>
        }
        {...form.getInputProps("monthly", { type: "checkbox" })}
      />
      <Button
        type={"submit"}
        className={"mt-5 self-end"}
        disabled={!form.isDirty() || !form.isValid()}
        leftSection={
          isLoading ? (
            <Loader color={"white"} size={"xs"} />
          ) : (
            <CheckIcon className={"h-4 w-4"} />
          )
        }
      >
        Update
      </Button>
    </form>
  );
};

export const openEditExpenseModal = ({ expense }: EditExpenseModalProps) => {
  modals.open({
    title: "Edit expense",
    children: <EditExpenseModal expense={expense} />,
  });
};
