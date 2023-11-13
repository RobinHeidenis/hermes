import { modals } from "@mantine/modals";
import {
  Button,
  CloseButton,
  Combobox,
  Input,
  InputBase,
  Loader,
  Text,
  TextInput,
  Title,
  useCombobox,
} from "@mantine/core";
import { api } from "~/utils/api";
import { useForm, zodResolver } from "@mantine/form";
import { updateListSchema } from "~/schemas/updateList";
import { CheckIcon, StoreIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/router";

const ListSettingsModal = ({
  listId,
  workspaceId,
}: {
  listId: string;
  workspaceId: string;
}) => {
  const router = useRouter();
  const { data } = api.list.getList.useQuery({ listId });
  const { data: loyaltyCards } = api.workspace.getLoyaltyCards.useQuery({
    workspaceId,
  });
  const utils = api.useUtils();
  const form = useForm({
    initialValues: {
      name: data!.name!,
      defaultLoyaltyCardId: data?.defaultLoyaltyCard?.id ?? null,
      listId,
    },
    validate: zodResolver(updateListSchema),
  });
  const { mutate: updateList, isLoading: isUpdateListLoading } =
    api.list.update.useMutation({
      onMutate: async (values) => {
        await utils.list.getList.cancel({ listId });
        utils.list.getList.setData({ listId }, (data) => {
          if (!data) return data;

          return {
            ...data,
            name: values.name,
          };
        });
      },
      onSuccess: (_data, variables) => {
        form.setInitialValues({
          listId: variables.listId,
          defaultLoyaltyCardId: variables.defaultLoyaltyCardId,
          name: variables.name,
        });
      },
      onSettled: () => utils.list.getList.invalidate({ listId }),
    });
  const { mutate: deleteList, isLoading: isDeleteListLoading } =
    api.list.delete.useMutation({
      onMutate: async () => {
        await utils.list.getList.cancel({ listId });
        utils.list.getList.setData({ listId }, undefined);
        utils.workspace.getWorkspace.setData({ workspaceId }, (data) => {
          if (!data) return data;

          return {
            ...data,
            lists: data.lists.filter((list) => list.id !== listId),
          };
        });
      },
      onSuccess: () => router.push(`/workspace/${workspaceId}`),
      onSettled: () => utils.list.getList.invalidate({ listId }),
    });
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const selectedOption = loyaltyCards?.find(
    ({ id }) => id === form.values.defaultLoyaltyCardId,
  );

  return (
    <div className={"flex flex-col"}>
      <form
        className={"flex flex-col"}
        onSubmit={form.onSubmit((values) => updateList(values))}
      >
        <Title order={5}>Settings</Title>
        <TextInput
          label={"List name"}
          className={"mt-1"}
          placeholder={"List name"}
          {...form.getInputProps("name")}
        />
        <Combobox
          store={combobox}
          withinPortal={false}
          onOptionSubmit={(val) => {
            form.setFieldValue("defaultLoyaltyCardId", val);
            combobox.closeDropdown();
          }}
        >
          <Combobox.Target>
            <InputBase
              label={"Default loyalty card"}
              component={"button"}
              type={"button"}
              className={"mt-3"}
              pointer
              rightSection={
                form.values.defaultLoyaltyCardId !== null ? (
                  <CloseButton
                    size="sm"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() =>
                      form.setFieldValue("defaultLoyaltyCardId", null)
                    }
                    aria-label="Clear value"
                  />
                ) : (
                  <Combobox.Chevron />
                )
              }
              onClick={() => combobox.toggleDropdown()}
              multiline
            >
              {selectedOption ? (
                <SelectOption
                  name={selectedOption.name}
                  store={selectedOption.store}
                />
              ) : (
                <Input.Placeholder>None</Input.Placeholder>
              )}
            </InputBase>
          </Combobox.Target>

          <Combobox.Dropdown>
            <Combobox.Options>
              {loyaltyCards?.map((loyaltyCard) => (
                <Combobox.Option value={loyaltyCard.id} key={loyaltyCard.id}>
                  <SelectOption
                    name={loyaltyCard.name}
                    store={loyaltyCard.store}
                  />
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>
        <Button
          type={"submit"}
          leftSection={
            isUpdateListLoading ? (
              <Loader size={"xs"} color={"white"} />
            ) : (
              <CheckIcon className={"h-4 w-4"} />
            )
          }
          className={"mt-5 self-end"}
          disabled={!form.isValid() || !form.isDirty()}
        >
          Save
        </Button>
      </form>
      <Title order={5} className={"mt-5"}>
        Danger zone
      </Title>
      <div
        className={
          "mt-1 flex flex-row items-center justify-between bg-[--mantine-color-red-light] p-3"
        }
      >
        <div>
          <Title order={6}>Delete this list</Title>
          <Text size={"md"}>This action is irreversible!</Text>
        </div>
        <Button
          color={"red"}
          variant={"outline"}
          className={"ml-3"}
          onClick={() =>
            modals.openConfirmModal({
              title: "Delete list?",
              children: (
                <Text>
                  Are you sure you want to delete this list? This action cannot
                  be undone!
                </Text>
              ),
              onConfirm: () => {
                deleteList({ listId });
                modals.closeAll();
              },
              labels: { confirm: "Delete", cancel: "Cancel" },
              confirmProps: {
                color: "red",
                leftSection: isDeleteListLoading ? (
                  <Loader size={"xs"} color={"white"} />
                ) : (
                  <Trash2Icon className={"h-4 w-4"} />
                ),
              },
            })
          }
          leftSection={
            isDeleteListLoading ? (
              <Loader size={"xs"} color={"white"} />
            ) : (
              <Trash2Icon className={"h-4 w-4"} />
            )
          }
        >
          Delete list
        </Button>
      </div>
    </div>
  );
};

export const openListSettingsModal = ({
  listId,
  workspaceId,
}: {
  listId: string;
  workspaceId: string;
}) =>
  modals.open({
    title: "List settings",
    children: <ListSettingsModal listId={listId} workspaceId={workspaceId} />,
  });

const SelectOption = ({ name, store }: { name: string; store: string }) => {
  return (
    <div className={"flex flex-col"}>
      <Text className={"flex flex-row items-center"}>
        <StoreIcon className={"mr-2 h-4 w-4"} />
        {store}
      </Text>
      <Text c={"dimmed"} size={"sm"}>
        {name}
      </Text>
    </div>
  );
};
