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

export const ProfilePageContent = ({ user }: { user: Session["user"] }) => {
  const form = useUserForm({
    initialValues: {
      name: user.name ?? "",
      email: user.email ?? "",
    },
    validateInputOnBlur: true,

    validate: zodResolver(updateUserSchema),
  });

  return (
    <Grid className={"w-full p-2"} justify={"space-between"} columns={2}>
      <UserFormProvider form={form}>
        <Grid.Col span={1}>
          <Card className={"mt-3 w-72"}>
            <UserForm image={user.image} />
          </Card>
        </Grid.Col>
        <Grid.Col className={"w-72 basis-auto"} span={1}>
          <Title order={4}>Your user card</Title>
          <Text>This is how you appear to other users</Text>
          <UserCardPreview user={user} />
        </Grid.Col>
        <Grid.Col span={1} className={"w-[19rem] basis-auto"}>
          <DefaultWorkspaceCard />
        </Grid.Col>
      </UserFormProvider>
    </Grid>
  );
};
