import {
  AppShell,
  Avatar,
  Image,
  Menu,
  Text,
  Title,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { type PropsWithChildren } from "react";
import {
  LayoutDashboardIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import { NextNavLink } from "~/components/navigation/NextNavLink";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";

const AppLogo = () => {
  return (
    <>
      <Image
        src={"/logo.png"}
        width={40}
        height={40}
        className={"mr-2 w-10"}
        alt={"logo"}
      />
      <Title>Hermes</Title>
    </>
  );
};

export const CustomAppShell = ({ children }: PropsWithChildren) => {
  const { user } = useUser();
  const { white } = useMantineTheme();
  const { pathname } = useRouter();
  const { data: defaultWorkspace, isFetched } =
    api.user.getDefaultWorkspace.useQuery(undefined, { enabled: !!user });

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header
        pl={"sm"}
        className={"flex flex-row items-center justify-between"}
      >
        {isFetched ? (
          <Link
            href={`/workspace/${defaultWorkspace?.id ?? ""}`}
            className={
              "flex items-center rounded-md px-2 py-1 hover:bg-[--mantine-color-default-hover]"
            }
          >
            <AppLogo />
          </Link>
        ) : (
          <div className={"flex items-center"}>
            <AppLogo />
          </div>
        )}

        {user && (
          <Menu zIndex={400}>
            <Menu.Target>
              <UnstyledButton
                className={`mr-5 flex items-center rounded-md p-2 hover:bg-[--mantine-color-default-hover]`}
              >
                <Avatar src={user.picture} className={"mr-3"} />
                <Text>{user.name}</Text>
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label className={"flex items-center"}>
                <Avatar src={user.picture} className={"mr-3"} />
                <div>
                  <Text c={white}>{user.name}</Text>
                  {user.email}
                </div>
              </Menu.Label>
              <Menu.Divider />
              <Menu.Item
                renderRoot={() => (
                  <NextNavLink
                    href={"/me"}
                    label={"Profile"}
                    leftSection={<UserIcon className={"h-4 w-4"} />}
                    pathname={pathname}
                  />
                )}
              />
              <Menu.Item
                renderRoot={() => (
                  <NextNavLink
                    href={"/workspace"}
                    label={"Workspaces"}
                    leftSection={<LayoutDashboardIcon className={"h-4 w-4"} />}
                    pathname={pathname}
                  />
                )}
              />
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
                href={"/api/auth/logout"}
                component={"a"}
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
