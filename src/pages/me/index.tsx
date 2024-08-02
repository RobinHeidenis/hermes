import { CustomAppShell } from "~/components/appshell/CustomAppShell";
import { Grid, Title } from "@mantine/core";
import { ProfilePageContent } from "~/components/pages/me/ProfilePageContent";
import { ProfilePageSkeleton } from "~/components/pages/me/ProfilePageSkeleton";
import { api } from "~/utils/api";
import type { AuthedProps } from "~/auth";
import { requireAuthSSP as getServerSideProps } from "~/auth";
import { useSetUser } from "~/hooks/useSetUser";

export { getServerSideProps };

export const ProfilePage = ({ user }: AuthedProps) => {
  useSetUser(user);

  const { data: defaultWorkspace, isLoading: isGetDefaultWorkspaceLoading } =
    api.user.getDefaultWorkspace.useQuery();
  const { data: workspaces, isLoading: isGetWorkspacesLoading } =
    api.workspace.getWorkspaces.useQuery();
  const isLoading =
    !workspaces || isGetDefaultWorkspaceLoading || isGetWorkspacesLoading;

  return (
    <CustomAppShell user={user}>
      <div className={"flex flex-col items-center"}>
        <div className={"3xl:w-1/3"}>
          <Title>Your profile</Title>
          <Grid className={"w-full p-2"} justify={"space-between"}>
            {isLoading ? (
              <ProfilePageSkeleton />
            ) : (
              <ProfilePageContent
                user={user}
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
