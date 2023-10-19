import { useRequireAuth } from "~/hooks/useRequireSignin";
import { CustomAppShell } from "~/components/appshell/CustomAppShell";
import { LoadingOverlay, Title } from "@mantine/core";
import { ProfilePageContent } from "~/components/pages/me/ProfilePageContent";

export const ProfilePage = () => {
  const { data } = useRequireAuth();

  return (
    <CustomAppShell>
      <Title>Your profile</Title>

      {!data || !data.user ? (
        <LoadingOverlay visible />
      ) : (
        <ProfilePageContent user={data.user} />
      )}
    </CustomAppShell>
  );
};

export default ProfilePage;
