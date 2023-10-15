// show workspace settings, such as what list is the default list, the name of the workspace, invites, etc.

import { CustomAppShell } from "~/components/appshell/CustomAppShell";
import { Title } from "@mantine/core";

export const SettingsPage = () => {
  return (
    <CustomAppShell>
      <Title>Workspace settings</Title>
    </CustomAppShell>
  );
};

export default SettingsPage;
