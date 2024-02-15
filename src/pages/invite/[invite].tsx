import { useRouter } from "next/router";
import { CustomAppShell } from "~/components/appshell/CustomAppShell";
import {
  Avatar,
  AvatarGroup,
  Button,
  Card,
  Center,
  HoverCard,
  Loader,
  Skeleton,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
} from "@mantine/core";
import { api } from "~/utils/api";
import { notifications } from "@mantine/notifications";
import { UserCard } from "~/components/user/UserCard";
import { StoreIcon, UserPlusIcon } from "lucide-react";
import { UserAvatar } from "~/components/pages/workspace/UserAvatar";
import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
} from "next";
import type { User } from "lucia";
import { validateRequest } from "~/auth";

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<{ user: User | null }>> => {
  const { user } = await validateRequest({
    req: context.req,
    res: context.res,
  });
  return { props: { user } };
};

const InvitePage = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { invite } = router.query;
  const { data, isLoading, isLoadingError } = api.invite.getInvite.useQuery(
    {
      inviteId: invite as string,
    },
    { enabled: !!invite && !!user, retry: false },
  );
  const { mutate, isLoading: isAcceptInviteLoading } =
    api.invite.acceptInvite.useMutation({
      onError: (e) => {
        notifications.show({
          id: "invitation_accepted_error",
          title: "Something went wrong",
          message: `Uh oh, something went wrong with accepting the invite. Please try again. Error message: ${e.message}`,
          color: "red",
          withCloseButton: true,
        });
      },
      onSuccess: async () => {
        notifications.show({
          id: "invite_accepted_success",
          title: "Accepted invite!",
          message:
            "You've successfully accepted the invite. Welcome to the team!",
          color: "green",
          withCloseButton: true,
        });
        await router.push(
          `/workspace/${data && !("code" in data) ? data.workspaceId : ""}`,
        );
      },
    });

  if (isLoadingError) {
    notifications.show({
      id: "invite_not_found_error",
      title: "Invite not found",
      message:
        "That invite was not found. If you think this is a mistake, ask the person who sent you the link to resend it or to create a new invite",
      color: "red",
      withCloseButton: true,
    });
    void router.push("/");
  }

  if (!user) {
    return (
      <CustomAppShell user={user}>
        <Center className={"h-[calc(100vh-136px)]"}>
          <Card className={"text-center"}>
            <Title order={2}>
              You&apos;ve been invited to join a workspace!
            </Title>
            <Title order={5} className={"mt-3"}>
              Please log in to join
            </Title>
            <div className={"w-fit self-center"}>
              <Button
                className={"mt-5 w-32"}
                component={"a"}
                href={`/auth/login?returnTo=${router.asPath}`}
              >
                Log in
              </Button>
            </div>
          </Card>
        </Center>
      </CustomAppShell>
    );
  }

  if (data && "code" in data) {
    notifications.show({
      id: "invite_user_already_in_workspace",
      title: "You're already in this workspace!",
      message: "You can find it on this page.",
    });
    void router.push("/workspace");
    return;
  }

  return (
    <CustomAppShell user={user}>
      <Center className={"h-[calc(100vh-136px)]"}>
        <Card className={"text-center"} bg={"dark.8"} withBorder>
          <Title order={2}>You&apos;re invited!</Title>
          <div className={"mx-5 mt-5 flex flex-col"}>
            {isLoading || !data ? (
              <Skeleton className={"h-14 w-48 self-center"} />
            ) : (
              <div className={"w-fit self-center"}>
                <UserCard
                  name={data.workspace.owner.name}
                  image={data.workspace.owner.image}
                />
              </div>
            )}
            <Title order={4} className={"mt-3"}>
              invited you to a workspace
            </Title>
            <Card className={"mt-5 flex w-80 flex-col"} p={"sm"}>
              <div className={"flex flex-row items-center"}>
                <ThemeIcon className={`mr-4 p-3`} size={"xl"} color={"dark.8"}>
                  <StoreIcon size={30} />
                </ThemeIcon>
                <div className={"flex flex-col items-start justify-center"}>
                  {isLoading || !data ? (
                    <>
                      <Skeleton className={"h-4 w-32"} />
                      <Skeleton className={"mt-2 h-6 w-20"} />
                    </>
                  ) : (
                    <>
                      <Title order={5} className={"text-start"}>
                        {data.workspace.name}
                      </Title>
                      <div className={"mt-2 flex flex-row items-center"}>
                        <Text className={"mr-2"}>Collaborators:</Text>
                        {data.workspace.usersToWorkspaces.length === 0 && (
                          <Tooltip label={"You'll be the first!"}>
                            <Text fw={700}>none</Text>
                          </Tooltip>
                        )}
                        <AvatarGroup>
                          {data.workspace.usersToWorkspaces.length > 3 ? (
                            <>
                              {data.workspace.usersToWorkspaces
                                .slice(0, 3)
                                .map(
                                  ({ user }) =>
                                    user.name &&
                                    user.image && (
                                      <UserAvatar
                                        name={user.name}
                                        image={user.image}
                                        key={user.id}
                                      />
                                    ),
                                )}
                              <HoverCard withArrow position={"bottom-start"}>
                                <HoverCard.Target>
                                  <Avatar size={"sm"}>
                                    +
                                    {data.workspace.usersToWorkspaces.length -
                                      3}
                                  </Avatar>
                                </HoverCard.Target>

                                <HoverCard.Dropdown>
                                  {data.workspace.usersToWorkspaces
                                    .slice(3)
                                    .map(({ user }) => (
                                      <div
                                        className={"flex pl-2"}
                                        key={user.id}
                                      >
                                        <Avatar src={user.image} size={"sm"} />
                                        <Text className={"ml-2"}>
                                          {user.name}
                                        </Text>
                                      </div>
                                    ))}
                                </HoverCard.Dropdown>
                              </HoverCard>
                            </>
                          ) : (
                            data.workspace.usersToWorkspaces.map(
                              ({ user }) =>
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
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Card>
            <Button
              className={"mt-5 w-fit self-center"}
              onClick={() => mutate({ inviteId: invite as string })}
              leftSection={
                isAcceptInviteLoading ? (
                  <Loader color={"white"} size={"xs"} />
                ) : (
                  <UserPlusIcon className={"h-5 w-5"} />
                )
              }
              disabled={isLoading || !data}
            >
              Accept invite
            </Button>
          </div>
        </Card>
      </Center>
    </CustomAppShell>
  );
};

export default InvitePage;
