import { useRequireAuth } from "~/hooks/useRequireSignin";
import { CustomAppShell } from "~/components/appshell/CustomAppShell";
import {
  Avatar,
  Card,
  Divider,
  LoadingOverlay,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { AtSignIcon } from "lucide-react";
import { api } from "~/utils/api";

export const ProfilePage = () => {
  const { data, status } = useRequireAuth();
  const { data: defaultWorkspace, isLoading } =
    api.user.getDefaultWorkspace.useQuery();

  return (
    <CustomAppShell>
      <Title>Your profile</Title>

      {status === "loading" || !data || isLoading ? (
        <LoadingOverlay />
      ) : (
        <div className={"w-fit"}>
          <TextInput
            label="Username"
            defaultValue={data.user.name ?? undefined}
          />
          <TextInput
            label={"Email"}
            defaultValue={data.user.email ?? undefined}
            leftSectionPointerEvents={"none"}
            leftSection={<AtSignIcon className={"h-4 w-4"} />}
          />
          <Card>
            <div className={"flex flex-row items-center"}>
              <Avatar src={data.user.image} className={"mr-3"} />
              <div>
                <Text>{data.user.name}</Text>
                <Text c={"dimmed"} size={"sm"}>
                  {data.user.email}
                </Text>
              </div>
            </div>
            <Divider className={"mb-3 mt-3"} />
            <Text fw={500}>Default workspace</Text>
            {defaultWorkspace?.name ?? "None"}
          </Card>
        </div>
      )}
    </CustomAppShell>
  );
};

export default ProfilePage;
