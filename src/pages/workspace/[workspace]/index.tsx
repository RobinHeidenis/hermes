import { CustomAppShell } from "~/components/appshell/CustomAppShell";
import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import {
  ActionIcon,
  Button,
  Card,
  Flex,
  Menu,
  Skeleton,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { UserAvatar } from "~/components/pages/workspace/UserAvatar";
import { ArrayDataDisplay, WorkspaceSkeletons } from "~/pages/workspace";
import { ListCard } from "~/components/pages/workspace/ListCard";
import {
  BarChart3Icon,
  ChevronDownIcon,
  CreditCardIcon,
  ListTodoIcon,
  PlusIcon,
  SettingsIcon,
  StoreIcon,
  WalletCardsIcon,
} from "lucide-react";
import { openWorkspaceSettingsModal } from "~/components/modals/WorkspaceSettingsModal";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { ContributorsCard } from "~/components/pages/workspace/ContributorsCard";
import { useHover } from "@mantine/hooks";
import { openLoyaltyCardModal } from "~/components/modals/LoyaltyCardModal";
import { Section } from "~/components/pages/workspace/Section";
import { openCreateListModal } from "~/components/modals/CreateListModal";
import { openCreateLoyaltyCardModal } from "~/components/modals/CreateLoyaltyCardModal";
import { Icon } from "~/components/Icon";

export const WorkspaceDetailPage = withPageAuthRequired(() => {
  const { query } = useRouter();
  const utils = api.useUtils();

  const { data: workspace, isLoading } = api.workspace.getWorkspace.useQuery(
    { workspaceId: query.workspace as string },
    { enabled: !!query.workspace },
  );
  const workspacesData = utils.workspace.getWorkspaces.getData();
  const basicWorkspaceInfo = workspacesData
    ? [
        ...workspacesData.ownedWorkspaces,
        ...workspacesData.collaboratingWorkspaces,
      ].filter((w) => w.id === query.workspace)[0]
    : undefined;
  const workspaceId =
    workspace?.id ?? basicWorkspaceInfo?.id ?? (query.workspace as string);

  return (
    <CustomAppShell>
      <>
        <div className={"flex items-center justify-between"}>
          <div>
            <Text
              c={"dimmed"}
              mt={{
                base: 11,
                md: 0,
              }}
              style={{ viewTransitionName: `workspace-header` }}
            >
              Workspace
            </Text>
            <Title
              visibleFrom={"sm"}
              style={{
                viewTransitionName: `workspace-title-${workspaceId}`,
              }}
            >
              {workspace?.name ?? basicWorkspaceInfo?.name ?? (
                <Skeleton className={"mt-1 h-10 w-40"} />
              )}
            </Title>
          </div>
          <div className={"flex flex-row self-start"}>
            <Menu>
              <Menu.Target>
                <Button
                  variant={"light"}
                  leftSection={<PlusIcon className={"h-5 w-5"} />}
                  rightSection={<ChevronDownIcon className={"h-4 w-4"} />}
                >
                  Create new
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  leftSection={
                    <Icon
                      IconComponent={ListTodoIcon}
                      className={"h-4 w-4"}
                      firefoxMarginClass={"mb-1"}
                    />
                  }
                  onClick={() => openCreateListModal({ workspaceId })}
                >
                  List
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <Icon
                      IconComponent={CreditCardIcon}
                      className={"h-4 w-4"}
                      firefoxMarginClass={"mb-1"}
                    />
                  }
                  onClick={() => openCreateLoyaltyCardModal({ workspaceId })}
                >
                  Loyalty card
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
            <ActionIcon
              color={"gray"}
              variant={"transparent"}
              className={"ml-3"}
              size={"lg"}
              onClick={() => openWorkspaceSettingsModal({ workspaceId })}
            >
              <SettingsIcon className={"h-5 w-5"} />
            </ActionIcon>
          </div>
        </div>
        <Title
          style={{
            viewTransitionName: `workspace-title-${workspaceId}`,
          }}
          className={"mt-1"}
          hiddenFrom={"sm"}
        >
          {workspace?.name ?? basicWorkspaceInfo?.name ?? (
            <Skeleton className={"mt-1 h-10 w-40"} />
          )}
        </Title>
        <div className={"mt-3 flex"}>
          <Card className={"flex flex-row items-center justify-center"}>
            <Text className={"mr-2"}>Owner:</Text>
            {workspace ? (
              <UserAvatar
                name={workspace.users.owner.name!}
                image={workspace.users.owner.image!}
              />
            ) : (
              <Skeleton radius={"xl"} className={"mr-2 h-7 w-7"} />
            )}
          </Card>
          {workspace && workspace.users.contributors.length > 1 && (
            <ContributorsCard contributors={workspace.users.contributors} />
          )}
        </div>
        <Section
          title={"Lists"}
          Icon={ListTodoIcon}
          transitionName={"list-header"}
        >
          <Flex
            gap={30}
            className={"mt-5 flex-wrap justify-center md:justify-start"}
          >
            <ArrayDataDisplay
              skeleton={<WorkspaceSkeletons />}
              noItems={"No items found :("}
              data={workspace}
              isLoading={isLoading}
              array={workspace?.lists ?? []}
              DisplayElement={ListCard}
            />
          </Flex>
        </Section>
        <Section title={"Loyalty cards"} Icon={WalletCardsIcon}>
          <Flex
            gap={30}
            className={"mt-5 flex-wrap justify-center md:justify-start"}
          >
            {workspace?.loyaltyCards ? (
              workspace.loyaltyCards.map((card) => (
                <LoyaltyCard card={card} key={card.id} />
              ))
            ) : (
              <WorkspaceSkeletons />
            )}
          </Flex>
        </Section>
        <div className={"mt-3 flex items-center"}>
          <Icon
            IconComponent={BarChart3Icon}
            className={"mr-2"}
            firefoxMarginClass={"mb-2"}
          />
          <Title order={2}>Expense report</Title>
        </div>
        <Text className={"mt-2"}>This feature is coming soon</Text>
      </>
    </CustomAppShell>
  );
});

export default WorkspaceDetailPage;

const LoyaltyCard = ({
  card,
}: {
  card: RouterOutputs["workspace"]["getWorkspace"]["loyaltyCards"][number];
}) => {
  const { hovered, ref } = useHover();
  const { query } = useRouter();

  return (
    <Card
      key={card.id}
      maw={"20rem"}
      miw={"20rem"}
      mah={"7rem"}
      mih={"7rem"}
      ref={ref}
      className={`mantine-focus-auto flex transform flex-col justify-between shadow-sm transition hover:scale-105 hover:cursor-pointer hover:shadow-md focus:scale-105`}
      withBorder
      onClick={() =>
        openLoyaltyCardModal({ card, workspaceId: query.workspace as string })
      }
      radius="md"
      bg={hovered ? "dark.5" : ""}
    >
      <div className={"flex h-auto items-start justify-start"}>
        <ThemeIcon className={`mr-4 p-3`} size={"xl"} color={"dark.7"}>
          <CreditCardIcon size={30} />
        </ThemeIcon>
        <div className={"flex flex-col"}>
          <div className={"flex flex-row items-start"}>
            <StoreIcon className={"mr-2 mt-1 h-4 w-4 shrink-0"} />
            <Title order={4}>{card.store}</Title>
          </div>
          <Title order={5} c={"dimmed"}>
            {card.name}
          </Title>
        </div>
      </div>
    </Card>
  );
};
