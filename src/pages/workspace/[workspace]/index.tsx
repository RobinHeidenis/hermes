import { CustomAppShell } from "~/components/appshell/CustomAppShell";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import {
  ActionIcon,
  Avatar,
  AvatarGroup,
  Button,
  Card,
  Flex,
  LoadingOverlay,
  Popover,
  Text,
  Title,
} from "@mantine/core";
import { UserAvatar } from "~/components/pages/workspace/UserAvatar";
import { ArrayDataDisplay, WorkspaceSkeletons } from "~/pages/workspace";
import { ListCard } from "~/components/pages/workspace/ListCard";
import { useHover } from "@mantine/hooks";
import {
  BarChart3Icon,
  ListTodoIcon,
  PlusIcon,
  SettingsIcon,
} from "lucide-react";
import { openCreateListModal } from "~/components/modals/CreateListModal";
import { openWorkspaceSettingsModal } from "~/components/modals/WorkspaceSettingsModal";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

export const WorkspaceDetailPage = withPageAuthRequired(() => {
  const { query } = useRouter();
  const { data: workspace, isLoading } = api.workspace.getWorkspace.useQuery(
    { workspaceId: query.workspace as string },
    { enabled: !!query.workspace },
  );
  const { hovered, ref } = useHover();

  if (isLoading || !workspace) {
    return (
      <CustomAppShell>
        <LoadingOverlay visible />
      </CustomAppShell>
    );
  }

  const { owner, contributors } = workspace.users;

  return (
    <CustomAppShell>
      {isLoading || !workspace ? (
        <LoadingOverlay visible />
      ) : (
        <>
          <div className={"flex items-center justify-between"}>
            <div>
              <Text c={"dimmed"}>Workspace</Text>
              <Title>{workspace.name}</Title>
            </div>
            <div className={"flex flex-row self-start"}>
              <Button
                variant={"light"}
                leftSection={<PlusIcon className={"h-5 w-5"} />}
                onClick={() =>
                  openCreateListModal({ workspaceId: workspace.id })
                }
              >
                New list
              </Button>
              <ActionIcon
                color={"gray"}
                variant={"transparent"}
                className={"ml-3"}
                size={"lg"}
                onClick={() =>
                  openWorkspaceSettingsModal({ workspaceId: workspace.id })
                }
              >
                <SettingsIcon className={"h-5 w-5"} />
              </ActionIcon>
            </div>
          </div>
          <div className={"mt-3 flex"}>
            <Card className={"flex flex-row justify-center"}>
              <Text className={"mr-2"}>Owner:</Text>
              <UserAvatar name={owner.name!} image={owner.image!} />
            </Card>
            {contributors.length > 1 && (
              <Card className={"ml-3 flex flex-row justify-center"}>
                <Text className={"mr-2"}>Contributors:</Text>
                <AvatarGroup>
                  {contributors.length > 3 ? (
                    <>
                      {contributors
                        .slice(0, 3)
                        .map(
                          (user) =>
                            user.name &&
                            user.image && (
                              <UserAvatar
                                name={user.name}
                                image={user.image}
                                key={user.id}
                              />
                            ),
                        )}
                      <Popover
                        opened={hovered}
                        withArrow
                        position={"bottom-start"}
                      >
                        <Popover.Target ref={ref}>
                          <Avatar size={"sm"}>
                            +{contributors.length - 3}
                          </Avatar>
                        </Popover.Target>

                        <Popover.Dropdown>
                          {contributors.slice(3).map((user) => (
                            <div className={"flex pl-2"} key={user.id}>
                              <Avatar src={user.image} size={"sm"} />
                              <Text className={"ml-2"}>{user.name}</Text>
                            </div>
                          ))}
                        </Popover.Dropdown>
                      </Popover>
                    </>
                  ) : (
                    contributors.map(
                      (user) =>
                        user.name &&
                        user.image && (
                          <UserAvatar
                            name={user.name}
                            image={user.image}
                            key={user.id}
                          />
                        ),
                    )
                  )}
                </AvatarGroup>
              </Card>
            )}
          </div>
          <div
            className={"mt-3 flex items-center justify-center md:justify-start"}
          >
            <ListTodoIcon className={"mr-2"} />
            <Title order={2}>Lists</Title>
          </div>
          <Flex
            gap={30}
            className={"mt-5 flex-wrap justify-center md:justify-start"}
          >
            <ArrayDataDisplay
              skeleton={<WorkspaceSkeletons />}
              noItems={"No items found :("}
              data={workspace}
              isLoading={isLoading}
              array={workspace.lists}
              DisplayElement={ListCard}
            />
          </Flex>
          <div className={"mt-3 flex items-center"}>
            <BarChart3Icon className={"mr-2"} />
            <Title order={2}>Expense report</Title>
          </div>
          <Text className={"mt-2"}>This feature is coming soon</Text>
        </>
      )}
    </CustomAppShell>
  );
});

export default WorkspaceDetailPage;
