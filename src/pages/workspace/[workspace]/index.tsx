import { CustomAppShell } from "~/components/appshell/CustomAppShell";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import {
  Avatar,
  AvatarGroup,
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

export const WorkspaceDetailPage = () => {
  const { query } = useRouter();
  const { data: workspace, isLoading } = api.workspace.getWorkspace.useQuery(
    { workspaceId: query.workspace as string },
    { enabled: !!query.workspace },
  );
  const { hovered, ref } = useHover();

  return (
    <CustomAppShell>
      {isLoading || !workspace ? (
        <LoadingOverlay visible />
      ) : (
        <>
          <Text c={"dimmed"}>Workspace</Text>
          <Title>{workspace.name}</Title>
          <div className={"mt-3 flex"}>
            <Card className={"flex flex-row justify-center"}>
              <Text className={"mr-2"}>Owned by:</Text>
              <UserAvatar
                name={workspace.users.owner.name!}
                image={workspace.users.owner.image!}
              />
            </Card>
            <Card className={"ml-3 flex flex-row justify-center"}>
              <Text className={"mr-2"}>Contributors:</Text>
              <AvatarGroup>
                {workspace.users.contributors.length > 3 ? (
                  <>
                    {workspace.users.contributors
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
                      <Popover.Target>
                        <Avatar size={"sm"} ref={ref}>
                          +{workspace.users.contributors.length - 3}
                        </Avatar>
                      </Popover.Target>

                      <Popover.Dropdown>
                        {workspace.users.contributors.slice(3).map((user) => (
                          <div className={"flex pl-2"} key={user.id}>
                            <Avatar src={user.image} size={"sm"} />
                            <Text className={"ml-2"}>{user.name}</Text>
                          </div>
                        ))}
                      </Popover.Dropdown>
                    </Popover>
                  </>
                ) : (
                  workspace.users.contributors.map(
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
          </div>
          <Title order={2} className={"mt-3"}>
            Lists
          </Title>
          <Flex gap={30} className={"mt-5 flex-wrap"}>
            <ArrayDataDisplay
              skeleton={<WorkspaceSkeletons />}
              noItems={"No items found :("}
              data={workspace}
              isLoading={isLoading}
              array={workspace.lists}
              DisplayElement={ListCard}
            />
          </Flex>
          <Title order={2} className={"mt-3"}>
            Expense report
          </Title>
          <Text className={"mt-2"}>This feature is coming soon</Text>
        </>
      )}
    </CustomAppShell>
  );
};

export default WorkspaceDetailPage;
