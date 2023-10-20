import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";
import { useForm, zodResolver } from "@mantine/form";
import { updateDefaultWorkspaceSchema } from "~/schemas/updateDefaultWorkspace";
import { Button, Loader, Select } from "@mantine/core";
import { CheckIcon } from "lucide-react";

export const DefaultWorkspaceForm = ({
  workspaces,
  defaultWorkspaceId,
}: {
  workspaces: RouterOutputs["workspace"]["getWorkspaces"];
  defaultWorkspaceId: string | undefined;
}) => {
  const form = useForm({
    initialValues: { workspaceId: defaultWorkspaceId },
    validate: zodResolver(updateDefaultWorkspaceSchema),
  });
  const { mutate, isLoading } = api.user.setDefaultWorkspace.useMutation({
    onSuccess: () => {
      form.setInitialValues({ workspaceId: form.values.workspaceId });
    },
  });

  return (
    <form
      className={"flex flex-col"}
      onSubmit={form.onSubmit(({ workspaceId }) =>
        mutate({ workspaceId: workspaceId ?? null }),
      )}
    >
      <Select
        className={"mt-3"}
        placeholder={"None"}
        {...form.getInputProps("workspaceId")}
        data={[
          {
            group: "Your workspaces",
            items: workspaces.ownedWorkspaces.map((w) => ({
              value: w.id,
              label: w.name,
            })),
          },
          {
            group: "Collaborating workspaces",
            items: workspaces.collaboratingWorkspaces.map((w) => ({
              value: w.id,
              label: w.name,
            })),
          },
        ]}
      />
      <Button
        className={"mt-5 w-24 self-end"}
        leftSection={
          isLoading ? <Loader color={"white"} size={"xs"} /> : <CheckIcon />
        }
        disabled={!form.isDirty()}
        type={"submit"}
      >
        Save
      </Button>
    </form>
  );
};
