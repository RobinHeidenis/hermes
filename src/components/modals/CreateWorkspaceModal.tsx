import { Button, Loader, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { createWorkspaceSchema } from "~/schemas/createWorkspace";
import { modals } from "@mantine/modals";
import { api } from "~/utils/api";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const CreateWorkspaceModal = () => {
  const form = useForm({
    initialValues: {
      name: "",
    },
    validate: zodResolver(createWorkspaceSchema),
  });
  const { mutateAsync, isLoading } = api.workspace.create.useMutation();
  const router = useRouter();

  useEffect(() => {
    window.history.pushState({}, "", "/workspace/new");
  }, []);

  return (
    <form
      onSubmit={form.onSubmit(
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async ({ name }) => {
          const id = await mutateAsync({ name });
          await router.push(`/workspace/${id}`);
          modals.closeAll();
        },
      )}
      className={"flex flex-col"}
    >
      <TextInput
        label={"Name"}
        placeholder={"Groceries"}
        data-autofocus
        {...form.getInputProps("name")}
      />
      <Button
        type={"submit"}
        className={"mt-5 self-end"}
        disabled={!form.isValid()}
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

export const openCreateWorkspaceModal = () => {
  modals.open({
    title: "Create a new workspace",
    children: <CreateWorkspaceModal />,
    onClose() {
      window.history.pushState({}, "", "/workspace");
    },
  });
};
