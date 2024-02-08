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
import { modals } from "@mantine/modals";
import { HelpCircleIcon, PlusIcon } from "lucide-react";
import { api } from "~/utils/api";
import { useForm, zodResolver } from "@mantine/form";
import { useRouter } from "next/router";
import { createExpenseSchema } from "~/schemas/createExpense";
import type { categoryEnum } from "~/server/db/schema";
import { DateInput, MonthPickerInput } from "@mantine/dates";
import "@mantine/dates/styles.css";

const selectInputData: {
  value: (typeof categoryEnum.enumValues)[number];
  label: string;
}[] = [
  { value: "groceries", label: "Groceries" },
  { value: "household", label: "Household" },
  { value: "snacks", label: "Snacks" },
  { value: "leisure", label: "Leisure" },
  { value: "fixed", label: "Fixed costs" },
  {
    value: "transport",
    label: "Transport & travel",
  },
  { value: "professional", label: "Professional" },
  { value: "pets", label: "Pets" },
  { value: "other", label: "Other" },
];

const CreateExpenseModal = () => {
  const { query } = useRouter();
  const { mutate, isLoading } = api.expense.createExpense.useMutation({
    onMutate: async (values) => {
      await utils.expense.getLast50Expenses.cancel({
        workspaceId: query.workspace as string,
      });
      const previousExpenses = utils.expense.getLast50Expenses.getData({
        workspaceId: query.workspace as string,
      });
      utils.expense.getLast50Expenses.setData(
        { workspaceId: query.workspace as string },
        (data) => {
          if (!data) return data;
          return [
            {
              id: "temp",
              name: values.name ?? null,
              price: values.price?.toString() ?? null,
              category: values.category ?? null,
              monthly: values.monthly ?? false,
              createdAt: new Date(),
              workspaceId: query.workspace as string,
            },
            ...data,
          ];
        },
      );

      modals.closeAll();
      return { previousExpenses };
    },
    onError: (_error, _list, context) => {
      utils.expense.getLast50Expenses.setData(
        { workspaceId: query.workspace as string },
        context?.previousExpenses,
      );
    },
    onSettled: () =>
      utils.expense.getLast50Expenses.invalidate({
        workspaceId: query.workspace as string,
      }),
  });
  const utils = api.useUtils();
  const form = useForm({
    initialValues: {
      name: "",
      price: 0.0,
      category: "other" as (typeof categoryEnum.enumValues)[number],
      monthly: false,
      date: new Date(),
      workspaceId: query.workspace as string,
    },
    validate: zodResolver(createExpenseSchema),
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
        {...form.getInputProps("monthly")}
      />
      <Button
        type={"submit"}
        className={"mt-5 self-end"}
        leftSection={
          isLoading ? (
            <Loader color={"white"} size={"xs"} />
          ) : (
            <PlusIcon className={"h-4 w-4"} />
          )
        }
      >
        Create
      </Button>
    </form>
  );
};

export const openCreateExpenseModal = () => {
  modals.open({
    title: "Add a new expense",
    children: <CreateExpenseModal />,
  });
};
