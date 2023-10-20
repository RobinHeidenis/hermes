import type { Session } from "next-auth";
import { zodResolver } from "@mantine/form";
import { Card, Grid, Text, Title } from "@mantine/core";
import { UserForm } from "./UserForm";
import {
  updateUserSchema,
  UserFormProvider,
  useUserForm,
} from "./updateUserFormContext";
import { UserCardPreview } from "./UserCardPreview";
import { DefaultWorkspaceCard } from "./DefaultWorkspaceCard";
import type { RouterOutputs } from "~/utils/api";

export const ProfilePageContent = ({
  user,
  defaultWorkspace,
  workspaces,
}: {
  user: Session["user"];
  defaultWorkspace: RouterOutputs["user"]["getDefaultWorkspace"] | undefined;
  workspaces: RouterOutputs["workspace"]["getWorkspaces"];
}) => {
  const form = useUserForm({
    initialValues: {
      name: user.name ?? "",
      email: user.email ?? "",
    },
    validateInputOnBlur: true,

    validate: zodResolver(updateUserSchema),
  });

  return (
    <UserFormProvider form={form}>
      <Grid.Col
        span={{ base: 12, sm: 6 }}
        order={{ base: 2, sm: 1 }}
        className={"mt-20 sm:mt-0"}
      >
        <Card className={"xs:w-72 mt-3"}>
          <UserForm image={user.image} />
        </Card>
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 6 }} order={{ base: 1, sm: 2 }}>
        <div className={"xs:w-72"}>
          <Title order={4}>Your user card</Title>
          <Text>This is how you appear to other users</Text>
          <UserCardPreview user={user} />
        </div>
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 6 }} order={3}>
        <div className={"xs:w-72"}>
          <DefaultWorkspaceCard
            workspaces={workspaces}
            defaultWorkspace={defaultWorkspace}
          />
        </div>
      </Grid.Col>
    </UserFormProvider>
  );
};
