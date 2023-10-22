import { Button, Loader, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { modals } from "@mantine/modals";
import { api } from "~/utils/api";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { createListSchema } from "~/schemas/createListSchema";

const CreateListModal = ({ workspaceId }: { workspaceId: string }) => {
  const form = useForm({
    initialValues: {
      name: "",
      workspaceId,
    },
    validate: zodResolver(createListSchema),
  });
  const { mutateAsync, isLoading } = api.list.create.useMutation();
  const router = useRouter();

  useEffect(() => {
    window.history.pushState({}, "", `${router.asPath}/new`);

    return () => window.history.pushState({}, "", router.asPath);
  }, [router.asPath]);

  return (
    <form
      onSubmit={form.onSubmit(
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async ({ name }) => {
          const id = await mutateAsync({ name, workspaceId });
          await router.push(`${router.asPath}/list/${id}`);
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

export const openCreateListModal = ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  modals.open({
    title: "Create a new list",
    children: <CreateListModal workspaceId={workspaceId} />,
  });
};
