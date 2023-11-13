import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";
import { useForm, zodResolver } from "@mantine/form";
import { modals } from "@mantine/modals";
import { Button, Loader, TextInput } from "@mantine/core";
import { CheckIcon } from "lucide-react";
import { editLoyaltyCardSchema } from "~/schemas/editLoyaltyCard";

const EditLoyaltyCardModal = ({
  workspaceId,
  card,
}: {
  workspaceId: string;
  card: RouterOutputs["workspace"]["getWorkspace"]["loyaltyCards"][number];
}) => {
  const form = useForm({
    initialValues: {
      workspaceId,
      loyaltyCardId: card.id,
      name: card.name,
      store: card.store,
      barcode: card.barcode,
    },
    validate: zodResolver(editLoyaltyCardSchema),
  });

  const utils = api.useUtils();

  const { mutate, isLoading } = api.loyaltyCard.updateLoyaltyCard.useMutation({
    onMutate: (variables) => {
      form.setInitialValues(variables);

      utils.workspace.getWorkspace.setData({ workspaceId }, (data) => {
        if (!data) return data;

        return {
          ...data,
          loyaltyCards: data.loyaltyCards.map((c) => {
            if (c.id === variables.loyaltyCardId) {
              return {
                ...c,
                name: variables.name,
                store: variables.store,
                barcode: variables.barcode,
              };
            }
            return c;
          }),
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
      <Button
        type={"submit"}
        className={"mt-5 self-end"}
        disabled={!form.isDirty() || !form.isValid()}
        leftSection={
          isLoading ? (
            <Loader size={"xs"} color={"white"} />
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

export const openEditLoyaltyCardModal = ({
  workspaceId,
  card,
}: {
  workspaceId: string;
  card: RouterOutputs["workspace"]["getWorkspace"]["loyaltyCards"][number];
}) => {
  modals.open({
    title: "Edit loyalty card",
    children: <EditLoyaltyCardModal workspaceId={workspaceId} card={card} />,
    onClose: () => modals.closeAll(),
  });
};
