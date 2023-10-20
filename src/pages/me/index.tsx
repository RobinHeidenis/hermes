import { useRequireAuth } from "~/hooks/useRequireSignin";
import { CustomAppShell } from "~/components/appshell/CustomAppShell";
import { Grid, Title } from "@mantine/core";
import { ProfilePageContent } from "~/components/pages/me/ProfilePageContent";
import { ProfilePageSkeleton } from "~/components/pages/me/ProfilePageSkeleton";
import { api } from "~/utils/api";

export const ProfilePage = () => {
  const { data } = useRequireAuth();
  const { data: defaultWorkspace, isLoading: isGetDefaultWorkspaceLoading } =
    api.user.getDefaultWorkspace.useQuery();
  const { data: workspaces, isLoading: isGetWorkspacesLoading } =
    api.workspace.getWorkspaces.useQuery();
  const isLoading =
    !data ||
    !data.user ||
    isGetDefaultWorkspaceLoading ||
    isGetWorkspacesLoading ||
    !workspaces;

  return (
    <CustomAppShell>
      <div className={"flex flex-col items-center"}>
        <div className={"3xl:w-1/3"}>
          <Title>Your profile</Title>
          <Grid className={"w-full p-2"} justify={"space-between"}>
            {isLoading ? (
              <ProfilePageSkeleton />
            ) : (
              <ProfilePageContent
                user={data.user}
                defaultWorkspace={defaultWorkspace}
                workspaces={workspaces}
              />
            )}
          </Grid>
        </div>
      </div>
    </CustomAppShell>
  );
};

export default ProfilePage;
