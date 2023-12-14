import { Button, Loader, NumberInput, Select, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { PlusIcon } from "lucide-react";
import { api } from "~/utils/api";
import { useForm, zodResolver } from "@mantine/form";
import { useRouter } from "next/router";
import { createExpenseSchema } from "~/schemas/createExpense";
import type { categoryEnum } from "~/server/db/schema";

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
            ...data,
            {
              id: "temp",
              name: values.name ?? null,
              price: values.price?.toString() ?? null,
              category: values.category ?? null,
              createdAt: new Date(),
              workspaceId: query.workspace as string,
            },
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
      workspaceId: query.workspace as string,
    },
    validate: zodResolver(createExpenseSchema),
  });

  return (
    <form
      className={"flex flex-col"}
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
        data={[
          { value: "groceries", label: "Groceries" },
          { value: "household", label: "Household" },
          { value: "snacks", label: "Snacks" },
          { value: "other", label: "Other" },
        ]}
        searchable
        allowDeselect={false}
        {...form.getInputProps("category")}
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
