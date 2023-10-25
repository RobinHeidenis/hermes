import { Button, Loader, NumberInput, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { CheckIcon } from "lucide-react";
import { api } from "~/utils/api";
import { useForm, zodResolver } from "@mantine/form";
import { editItemSchema } from "~/schemas/editItem";

const EditItemModal = ({
  listId,
  itemId,
  forceUpdate,
}: {
  listId: string;
  itemId: string;
  forceUpdate: () => void;
}) => {
  const utils = api.useUtils();
  const originalItem = utils.list.getList
    .getData({ listId })
    ?.items.find((item) => item.id === itemId);

  const form = useForm({
    initialValues: {
      id: itemId,
      name: originalItem?.name ?? "",
      quantity: originalItem?.quantity ?? undefined,
      price: originalItem?.price ?? undefined,
      url: originalItem?.externalUrl ?? undefined,
    },
    validate: zodResolver(editItemSchema),
  });
  const { mutate: editItem, isLoading: isEditingItem } =
    api.item.edit.useMutation({
      onMutate: async (values) => {
        await utils.list.getList.cancel({ listId });
        const originalList = utils.list.getList.getData({ listId });
        utils.list.getList.setData({ listId }, (oldList) => {
          if (!oldList) return oldList;

          const updatedItems = [...oldList.items];
          const itemToUpdate = updatedItems.find(
            (item) => item.id === values.id,
          );

          if (!itemToUpdate) return oldList;

          itemToUpdate.name = values.name;
          itemToUpdate.quantity = values.quantity ?? null;
          itemToUpdate.price = values.price?.toString() ?? null;
          itemToUpdate.externalUrl = values.url ?? null;

          return {
            ...oldList,
            items: updatedItems,
          };
        });

        modals.closeAll();
        forceUpdate();
        return { originalList };
      },
      onError: (_error, _list, context) => {
        utils.list.getList.setData({ listId }, context?.originalList);
      },
      onSettled: () => utils.list.getList.invalidate({ listId }),
    });

  return (
    <form
      className={"flex flex-col"}
      onSubmit={form.onSubmit((values) => {
        editItem({
          ...values,
          price: values.price ? parseFloat(values.price) : null,
        });
      })}
    >
      <TextInput
        label={"Name"}
        withAsterisk
        data-autofocus
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
          isEditingItem ? (
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

export const openEditItemModal = ({
  listId,
  itemId,
  forceUpdate,
}: {
  listId: string;
  itemId: string;
  forceUpdate: () => void;
}) => {
  modals.open({
    title: "Edit item",
    children: (
      <EditItemModal
        listId={listId}
        itemId={itemId}
        forceUpdate={forceUpdate}
      />
    ),
  });
};
