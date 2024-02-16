import {
  AppShell,
  Avatar,
  Burger,
  Group,
  Image,
  Menu,
  NavLink,
  ScrollArea,
  Text,
  Title,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { type PropsWithChildren } from "react";
import {
  BarChart3Icon,
  ChevronRight,
  CreditCardIcon,
  HomeIcon,
  LayoutDashboardIcon,
  ListTodoIcon,
  LogOutIcon,
  StoreIcon,
  UserIcon,
} from "lucide-react";
import { NextNavLink } from "~/components/navigation/NextNavLink";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Link from "next/link";
import { useDisclosure } from "@mantine/hooks";
import { Icon } from "~/components/Icon";
import type { User } from "lucia";
import { SignOutForm } from "~/components/navigation/SignOutForm";
import { openLoyaltyCardModal } from "~/components/modals/LoyaltyCardModal";

const AppLogo = () => {
  const isFirefox =
    typeof window !== "undefined" &&
    navigator &&
    navigator?.userAgent.indexOf("Firefox") > -1;

  return (
    <>
      <Image
        src={"/logo.png"}
        width={80}
        height={80}
        className={"mr-2 w-16"}
        alt={"logo"}
      />
      <Title className={isFirefox ? "mt-2" : ""}>Hermes</Title>
    </>
  );
};

export const CustomAppShell = ({
  children,
  user,
}: PropsWithChildren<{ user: User | null }>) => {
  const { white } = useMantineTheme();
  const { pathname, asPath, query } = useRouter();
  const [opened, { toggle }] = useDisclosure();
  const { data: defaultWorkspace } = api.user.getDefaultWorkspace.useQuery(
    undefined,
    { enabled: !!user },
  );
  const { data: menuData } = api.user.getMenuData.useQuery(undefined, {
    enabled: !!user,
  });

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "md",
        collapsed: { desktop: false, mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header
        pl={"sm"}
        className={"flex flex-row items-center justify-between"}
      >
        <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" />
        <Group
          justify={"space-between"}
          className={
            "hover:bg[--mantine-color-default-hover] flex items-center"
          }
        >
          <Link
            href={"/workspace"}
            className={
              "hover:bg[--mantine-color-default-hover] flex items-center rounded-md px-2 py-1"
            }
          >
            <AppLogo />
          </Link>
          <Group ml="xl" gap={0} visibleFrom={"md"}>
            {defaultWorkspace && (
              <NextNavLink
                href={`/workspace/${defaultWorkspace.id}`}
                pathname={asPath}
                label={"Default workspace"}
                className={"mr-2 w-fit rounded-md"}
                leftSection={
                  <Icon
                    IconComponent={HomeIcon}
                    className={"h-4 w-4"}
                    firefoxMarginClass={"mb-1"}
                  />
                }
              />
            )}
            <NextNavLink
              href={"/workspace"}
              label={"Workspaces"}
              className={"w-fit rounded-md"}
              pathname={pathname}
              leftSection={
                <Icon
                  IconComponent={StoreIcon}
                  className={"h-4 w-4"}
                  firefoxMarginClass={"mb-1"}
                />
              }
            />
          </Group>
        </Group>

        {user && (
          <Menu zIndex={400}>
            <Menu.Target>
              <UnstyledButton
                className={`mr-5 flex items-center rounded-md p-2 hover:bg-[--mantine-color-default-hover]`}
              >
                <Avatar src={user.image} />
                <Text visibleFrom={"sm"} className={"ml-3"}>
                  {user.name}
                </Text>
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label className={"flex items-center"}>
                <Avatar src={user.image} className={"mr-3"} />
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
              <Menu.Divider />
              <SignOutForm>
                <Menu.Item
                  color="red"
                  leftSection={<LogOutIcon className={"h-4 w-4"} />}
                  component={"button"}
                  type={"submit"}
                >
                  Sign out
                </Menu.Item>
              </SignOutForm>
            </Menu.Dropdown>
          </Menu>
        )}
      </AppShell.Header>

      <AppShell.Navbar p="sm" px={4}>
        <AppShell.Section className={"mb-3 w-full"}>
          <UnstyledButton
            className={`flex w-full items-center justify-between rounded-md px-3 py-2 ${
              pathname === "/me"
                ? "bg-[--mantine-primary-color-light] text-[--mantine-primary-color-light-color] hover:bg-[--mantine-primary-color-light-hover]"
                : "hover:bg-[--mantine-color-default-hover]"
            }`}
            component={Link}
            href={"/me"}
            onClick={toggle}
          >
            <Group>
              <Avatar src={user?.image} radius={"xl"} />
              <div className={"flex flex-col"}>
                <Text size="md" fw={500}>
                  {user?.name}
                </Text>
                <Text c="dimmed" size={"xs"}>
                  {user?.email}
                </Text>
              </div>
            </Group>
            <ChevronRight className={"h-5 w-5 text-gray-400"} />
          </UnstyledButton>
        </AppShell.Section>
        <AppShell.Section className={"ml-3"}>
          Where do you want to go?
        </AppShell.Section>
        <NextNavLink
          href={"/workspace"}
          label={"Workspaces overview"}
          className={"rounded-md"}
          pathname={pathname}
          leftSection={
            <Icon
              IconComponent={StoreIcon}
              className={"h-4 w-4"}
              firefoxMarginClass={"mb-1"}
            />
          }
        />
        <AppShell.Section grow component={ScrollArea} className={"mb-10"}>
          {menuData?.workspaces.map((workspace) => (
            <NavLink
              className={"flex items-center rounded-md"}
              key={`workspace-${workspace.id}`}
              leftSection={<StoreIcon className={"h-4 w-4"} />}
              label={workspace.name}
              defaultOpened={workspace.id === query.workspace}
              active={workspace.id === query.workspace}
            >
              <NextNavLink
                className={"flex items-center rounded-md"}
                leftSection={<HomeIcon className={"h-4 w-4"} />}
                href={`/workspace/${workspace.id}`}
                label={"Workspace"}
                onClick={toggle}
                pathname={asPath}
              />
              <Text className={"mb-1 ml-3 mt-2"} size={"sm"} fw={700}>
                Lists
              </Text>
              {workspace.lists.map((list) => (
                <NextNavLink
                  key={`list-${list.id}`}
                  className={"flex items-center rounded-md"}
                  leftSection={<ListTodoIcon className={"h-4 w-4"} />}
                  href={`/workspace/${workspace.id}/list/${list.id}`}
                  label={list.name ?? "list"}
                  onClick={toggle}
                  pathname={asPath}
                />
              ))}
              <Text className={"mb-1 ml-3 mt-2"} size={"sm"} fw={700}>
                Loyalty cards
              </Text>
              {workspace.loyaltyCards.map((loyaltyCard) => (
                <NavLink
                  key={`loyaltycard-${loyaltyCard.id}`}
                  className={"flex items-center rounded-md"}
                  leftSection={<CreditCardIcon className={"h-4 w-4"} />}
                  label={loyaltyCard.name}
                  onClick={() => {
                    toggle();
                    openLoyaltyCardModal({
                      card: loyaltyCard,
                      workspaceId: workspace.id,
                    });
                  }}
                />
              ))}
              <Text className={"mb-1 ml-3 mt-2"} size={"sm"} fw={700}>
                Expenses
              </Text>
              <NextNavLink
                className={"flex items-center rounded-md"}
                leftSection={<BarChart3Icon className={"h-4 w-4"} />}
                href={`/workspace/${workspace.id}/expenses`}
                pathname={asPath}
                label={"Expense overview"}
                onClick={toggle}
              />
            </NavLink>
          ))}
        </AppShell.Section>
        <AppShell.Section>
          <SignOutForm>
            <NavLink
              leftSection={<LogOutIcon className={"h-4 w-4"} />}
              label={"Sign out"}
              component={"button"}
              className={
                "self-end text-red-500 hover:bg-[--mantine-color-red-light-hover]"
              }
              type={"submit"}
            />
          </SignOutForm>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};
