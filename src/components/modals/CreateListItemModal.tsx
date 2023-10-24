import { Button, Loader, NumberInput, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { PlusIcon } from "lucide-react";
import { api } from "~/utils/api";
import { useForm, zodResolver } from "@mantine/form";
import { createItemSchema } from "~/schemas/createItem";

const CreateListItemModal = ({ listId }: { listId: string }) => {
  const { mutate, isLoading } = api.item.create.useMutation({
    onMutate: async (values) => {
      await utils.list.getList.cancel({ listId });
      const previousList = utils.list.getList.getData({ listId });
      utils.list.getList.setData({ listId }, (data) => {
        if (!data) return data;
        const updatedItems = [
          ...data.items,
          {
            id: "temp",
            name: values.name ?? null,
            price: values.price?.toString() ?? null,
            quantity: values.quantity ?? null,
            externalUrl: values.url ?? null,
            checked: false,
            position: data.items.length,
          },
        ];
        return { ...data, items: updatedItems };
      });

      modals.closeAll();
      return { previousList };
    },
    onError: (_error, _list, context) => {
      utils.list.getList.setData({ listId }, context?.previousList);
    },
    onSettled: () => utils.list.getList.invalidate({ listId }),
  });
  const utils = api.useContext();
  const form = useForm({
    initialValues: {
      name: "",
      quantity: null,
      price: null,
      url: null,
      listId,
    },
    validate: zodResolver(createItemSchema),
  });

  return (
    <form
      className={"flex flex-col"}
      onSubmit={form.onSubmit((values) => mutate(values))}
    >
      <TextInput
        label={"Name"}
        withAsterisk
        placeholder={"Milk"}
        {...form.getInputProps("name")}
      />
      <div className={"mt-3 flex flex-row"}>
        <TextInput
          label={"Quantity"}
          placeholder={"3 bottles"}
          className={"mr-3 w-4/6"}
          {...form.getInputProps("quantity")}
        />
        <NumberInput
          label={"Price"}
          placeholder={"5.99"}
          className={"w-2/6"}
          decimalScale={2}
          fixedDecimalScale
          {...form.getInputProps("price")}
        />
      </div>
      <TextInput
        label={"URL"}
        placeholder={"https://ah.nl/product/melk"}
        className={"mt-3"}
        {...form.getInputProps("url")}
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

export const openCreateListItemModal = ({ listId }: { listId: string }) => {
  modals.open({
    title: "Add a new item",
    children: <CreateListItemModal listId={listId} />,
  });
};
