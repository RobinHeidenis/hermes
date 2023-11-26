import { api } from "~/utils/api";
import { useForm, zodResolver } from "@mantine/form";
import { modals } from "@mantine/modals";
import { Button, Checkbox, Loader, TextInput } from "@mantine/core";
import { PlusIcon } from "lucide-react";
import { createLoyaltyCardSchema } from "~/schemas/createLoyaltyCard";

const CreateLoyaltyCardModal = ({ workspaceId }: { workspaceId: string }) => {
  const form = useForm({
    initialValues: {
      workspaceId,
      name: "Loyalty card",
      store: "",
      barcode: "",
      isQR: false,
    },
    validate: zodResolver(createLoyaltyCardSchema),
  });

  const utils = api.useUtils();

  const { mutate, isLoading } = api.loyaltyCard.createLoyaltyCard.useMutation({
    onMutate: (variables) => {
      form.setInitialValues(variables);

      utils.workspace.getWorkspace.setData({ workspaceId }, (data) => {
        if (!data) return data;

        return {
          ...data,
          loyaltyCards: [...data.loyaltyCards, { ...variables, id: "temp" }],
        };
      });
    },
    onSuccess: () => modals.closeAll(),
    onSettled: () => utils.workspace.getWorkspace.invalidate({ workspaceId }),
  });

  return (
    <form
      className={"flex flex-col"}
      onSubmit={form.onSubmit((values) => {
        mutate(values);
      })}
    >
      <TextInput
        label={"Store"}
        withAsterisk
        data-autofocus
        placeholder={"Albert Heijn"}
        {...form.getInputProps("store")}
      />
      <TextInput
        label={"Name"}
        withAsterisk
        placeholder={"Bonuscard"}
        className={"mt-3"}
        {...form.getInputProps("name")}
      />
      <TextInput
        label={"Barcode"}
        withAsterisk
        placeholder={"0000000000000"}
        className={"mt-3"}
        {...form.getInputProps("barcode")}
      />
      <Checkbox
        label={"QR Code"}
        description={
          "This loyalty card should be shown as a QR Code instead of a barcode"
        }
        className={"mt-5"}
        {...form.getInputProps("isQR")}
      />
      <Button
        type={"submit"}
        className={"mt-5 self-end"}
        disabled={!form.isDirty() || !form.isValid()}
        leftSection={
          isLoading ? (
            <Loader size={"xs"} color={"white"} />
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

export const openCreateLoyaltyCardModal = ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  modals.open({
    title: "Edit loyalty card",
    children: <CreateLoyaltyCardModal workspaceId={workspaceId} />,
  });
};
