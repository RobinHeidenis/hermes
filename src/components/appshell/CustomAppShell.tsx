import {
  AppShell,
  Avatar,
  Menu,
  Text,
  Title,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { type PropsWithChildren } from "react";
import {
  ComponentIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export const CustomAppShell = ({ children }: PropsWithChildren) => {
  const { data } = useSession();
  const { white } = useMantineTheme();

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header
        pl={"sm"}
        className={"flex flex-row items-center justify-between"}
      >
        <div className={"flex items-center"}>
          <Avatar radius={"xl"} className={"mr-2"}>
            <ComponentIcon />
          </Avatar>
          <Title>Hermes</Title>
        </div>
        {data?.user && (
          <Menu>
            <Menu.Target>
              <UnstyledButton
                className={`mr-5 flex items-center rounded-md p-2 hover:bg-[--mantine-color-default-hover]`}
              >
                <Avatar src={data.user.image} className={"mr-3"} />
                <Text>{data.user.name}</Text>
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label className={"flex items-center"}>
                <Avatar src={data.user.image} className={"mr-3"} />
                <div>
                  <Text c={white}>{data.user.name}</Text>
                  {data.user.email}
                </div>
              </Menu.Label>
              <Menu.Divider />
              <Menu.Item
                leftSection={<UserIcon className={"h-4 w-4"} />}
                disabled
              >
                Profile
              </Menu.Item>
              <Menu.Item
                leftSection={<LayoutDashboardIcon className={"h-4 w-4"} />}
                disabled
              >
                Workspaces
              </Menu.Item>
              <Menu.Item
                leftSection={<SettingsIcon className={"h-4 w-4"} />}
                disabled
              >
                Settings
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                color="red"
                leftSection={<LogOutIcon className={"h-4 w-4"} />}
                onClick={() => void signOut()}
              >
                Sign out
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};
