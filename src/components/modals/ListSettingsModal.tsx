import { modals } from "@mantine/modals";
import { Button, Loader, Text, TextInput, Title } from "@mantine/core";
import { api } from "~/utils/api";
import { useForm, zodResolver } from "@mantine/form";
import { updateListSchema } from "~/schemas/updateList";
import { CheckIcon, Trash2Icon } from "lucide-react";
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
  const utils = api.useUtils();
  const form = useForm({
    initialValues: {
      name: data!.name!,
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
