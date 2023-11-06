import { modals } from "@mantine/modals";
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Card,
  CopyButton,
  Loader,
  LoadingOverlay,
  Select,
  Skeleton,
  Table,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  CheckIcon,
  ClipboardEditIcon,
  LogOutIcon,
  PlusIcon,
  RefreshCcwIcon,
  Trash2Icon,
  UserMinusIcon,
} from "lucide-react";
import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";
import { useForm, zodResolver } from "@mantine/form";
import { listSettingSchema } from "~/schemas/listSettings";
import { useRouter } from "next/router";
import { useUser } from "@auth0/nextjs-auth0/client";

const WorkspaceSettingsModal = ({ workspaceId }: { workspaceId: string }) => {
  const { user } = useUser();
  const { data: workspace } = api.workspace.getWorkspace.useQuery({
    workspaceId,
  });
  if (!workspace)
    return (
      <div className={"relative h-96"}>
        <LoadingOverlay visible />
      </div>
    );
  const currentUserIsOwner = user?.sub === workspace.users.owner.id;

  return (
    <div className={"flex flex-col"}>
      {currentUserIsOwner && (
        <SettingsForm
          lists={workspace.lists}
          defaultListId={workspace.defaultListId}
          workspaceId={workspace.id}
          name={workspace.name}
        />
      )}
      <ListUsersSection
        users={workspace.users}
        currentUserIsOwner={currentUserIsOwner}
        workspaceId={workspace.id}
      />
      <WorkspaceInvitesSection workspaceId={workspace.id} />
      <DangerZoneSection
        workspaceId={workspace.id}
        currentUserIsOwner={currentUserIsOwner}
      />
    </div>
  );
};

export const openWorkspaceSettingsModal = ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  modals.open({
    title: "Workspace settings",
    children: <WorkspaceSettingsModal workspaceId={workspaceId} />,
  });
};

const SettingsForm = ({
  name,
  lists,
  defaultListId,
  workspaceId,
}: {
  name: string;
  lists: RouterOutputs["workspace"]["getWorkspace"]["lists"];
  defaultListId: string | null;
  workspaceId: string;
}) => {
  const utils = api.useUtils();
  const form = useForm({
    initialValues: {
      name,
      listId: defaultListId,
      workspaceId,
    },
    validate: zodResolver(listSettingSchema),
  });
  const { mutate, isLoading } = api.workspace.updateListSettings.useMutation({
    onMutate: async (values) => {
      await utils.workspace.getWorkspace.cancel({ workspaceId });
      utils.workspace.getWorkspace.setData(
        { workspaceId },
        (currentWorkspace) => {
          if (!currentWorkspace) return currentWorkspace;

          return {
            ...currentWorkspace,
            name: values.name,
            defaultListId: values.listId,
          };
        },
      );
    },
    onSuccess: (_data, variables) => {
      form.setInitialValues(variables);
    },
    onSettled: () => utils.workspace.getWorkspace.invalidate({ workspaceId }),
  });

  return (
    <form
      className={"flex flex-col"}
      onSubmit={form.onSubmit((values) => mutate(values))}
    >
      <Title order={5}>Settings</Title>
      <TextInput
        label={"Workspace name"}
        className={"mt-1"}
        placeholder={"My household"}
        {...form.getInputProps("name")}
      />
      <Select
        label={"Default list"}
        placeholder={"None"}
        className={"mt-2"}
        data={lists.map((list) => ({
          label: list.name ?? "Unknown",
          value: list.id,
        }))}
        {...form.getInputProps("listId")}
      />
      <Button
        leftSection={
          isLoading ? (
            <Loader size={"xs"} color={"white"} />
          ) : (
            <CheckIcon className={"h-4 w-4"} />
          )
        }
        disabled={!form.isValid() || !form.isDirty()}
        className={"mt-5 self-end"}
        type={"submit"}
      >
        Save
      </Button>
    </form>
  );
};

const ListUsersSection = ({
  users,
  currentUserIsOwner,
  workspaceId,
}: {
  users: RouterOutputs["workspace"]["getWorkspace"]["users"];
  currentUserIsOwner?: boolean;
  workspaceId: string;
}) => {
  const { user } = useUser();
  const userId = user?.sub;

  return (
    <>
      <Title order={5}>Users in this list</Title>
      <ListUserCard
        user={users.owner}
        isOwner
        isDeletable={currentUserIsOwner}
        isCurrentUser={currentUserIsOwner}
        workspaceId={workspaceId}
      />
      {users.contributors.map((contributor) => (
        <ListUserCard
          user={contributor}
          key={contributor.id}
          isCurrentUser={userId === contributor.id}
          isDeletable={currentUserIsOwner}
          workspaceId={workspaceId}
        />
      ))}
    </>
  );
};

const ListUserCard = ({
  user,
  isOwner,
  isCurrentUser,
  isDeletable,
  workspaceId,
}: {
  user: RouterOutputs["workspace"]["getWorkspace"]["users"]["contributors"][number];
  isOwner?: boolean;
  isCurrentUser?: boolean;
  isDeletable?: boolean;
  workspaceId: string;
}) => {
  const utils = api.useUtils();
  const { mutate: kickUser } = api.workspace.kickUser.useMutation({
    onMutate: async (user) => {
      await utils.workspace.getWorkspace.cancel({ workspaceId });
      utils.workspace.getWorkspace.setData(
        { workspaceId },
        (currentWorkspace) => {
          if (!currentWorkspace) return currentWorkspace;

          return {
            ...currentWorkspace,
            users: {
              ...currentWorkspace.users,
              contributors: currentWorkspace.users.contributors.filter(
                (contributor) => contributor.id !== user.userId,
              ),
            },
          };
        },
      );
    },
    onSettled: () => utils.workspace.getWorkspace.invalidate({ workspaceId }),
  });

  return (
    <Card
      className={"mt-2 flex flex-row items-center justify-between"}
      padding={"xs"}
    >
      <div className={"flex flex-row items-center"}>
        <Avatar src={user.image} size={"sm"} className={"mr-2"} />
        <Text>{user.name}</Text>
      </div>
      <div>
        {isOwner && (
          <Badge variant={"light"} color={"green"}>
            Workspace owner
          </Badge>
        )}
        {isCurrentUser ? (
          isDeletable ? (
            <Tooltip
              label={"You can't remove yourself from your own list"}
              bg={"dark.5"}
              c={"white"}
            >
              <Badge variant={"light"} className={"ml-3"}>
                You
              </Badge>
            </Tooltip>
          ) : (
            <Badge variant={"light"} className={"ml-3"}>
              You
            </Badge>
          )
        ) : (
          isDeletable && (
            <ActionIcon
              variant={"light"}
              color={"red"}
              onClick={() =>
                modals.openConfirmModal({
                  title: "Remove user? :(",
                  children: (
                    <div
                      className={"flex flex-col items-center justify-center"}
                    >
                      <Avatar src={user.image} size={"xl"} className={"mr-2"} />
                      <Text className={"mt-2"}>{user.name}</Text>
                      <Text className={"mt-5"}>
                        Are you sure you want to remove <span>{user.name}</span>{" "}
                        from this list?
                      </Text>
                    </div>
                  ),
                  labels: { confirm: "Remove", cancel: "Cancel" },
                  confirmProps: {
                    color: "red",
                    leftSection: <UserMinusIcon className={"h-4 w-4"} />,
                  },
                  onConfirm: () => kickUser({ userId: user.id, workspaceId }),
                })
              }
            >
              <UserMinusIcon className={"h-4 w-4"} />
            </ActionIcon>
          )
        )}
      </div>
    </Card>
  );
};

const InviteRow = ({
  invite,
  workspaceId,
}: {
  invite: NonNullable<RouterOutputs["invite"]["getInviteForWorkspace"]>;
  workspaceId: string;
}) => {
  const utils = api.useUtils();
  const { mutate, isLoading } = api.invite.deleteInvite.useMutation({
    onSuccess: () =>
      utils.invite.getInviteForWorkspace.invalidate({
        workspaceId,
      }),
  });

  return (
    <Table.Tr key={invite.id}>
      <Table.Td>{invite.id}</Table.Td>
      <Table.Td>{invite.createdAt?.toLocaleString()}</Table.Td>
      <Table.Td className={"text-end"}>
        <CopyButton value={`${window.location.origin}/invite/${invite.id}`}>
          {({ copied, copy }) => (
            <ActionIcon
              onClick={copy}
              variant={"light"}
              color={copied ? "teal" : "blue"}
            >
              {copied ? (
                <CheckIcon className={"h-4 w-4"} />
              ) : (
                <ClipboardEditIcon className={"h-4 w-4"} />
              )}
            </ActionIcon>
          )}
        </CopyButton>
        <ActionIcon
          onClick={() => {
            modals.openConfirmModal({
              title: "Delete invite?",
              children:
                "Are you sure you want to delete this invite? Anyone that has this link will not be able to join your workspace!",
              confirmProps: {
                color: "red",
                leftSection: <Trash2Icon className={"h-4 w-4"} />,
              },
              labels: { confirm: "Delete", cancel: "Cancel" },
              onConfirm: () => mutate({ inviteId: invite.id }),
            });
          }}
          variant={"light"}
          className={"ml-3"}
          color={"red"}
        >
          {isLoading ? (
            <Loader color={"white"} size={"xs"} />
          ) : (
            <Trash2Icon className={"h-4 w-4"} />
          )}
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  );
};

export const WorkspaceInvitesSection = ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const utils = api.useUtils();
  const { data, isLoading } = api.invite.getInviteForWorkspace.useQuery({
    workspaceId,
  });
  const { mutate, isLoading: isCreateInviteLoading } =
    api.invite.createInvite.useMutation({
      onSuccess: () =>
        utils.invite.getInviteForWorkspace.invalidate({ workspaceId }),
    });
  const { mutate: regenerateInvite } = api.invite.regenerateInvite.useMutation({
    onSuccess: () =>
      utils.invite.getInviteForWorkspace.invalidate({ workspaceId }),
  });

  return (
    <>
      <Title order={5} className={"mt-5"}>
        Invite
      </Title>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th className={"w-16"}>Code</Table.Th>
            <Table.Th>Created at</Table.Th>
            <Table.Th className={"text-end"}>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {isLoading ? (
            <Table.Tr>
              <Table.Td colSpan={3}>
                <Skeleton className={"h-7 w-full"} />
              </Table.Td>
            </Table.Tr>
          ) : !data ? (
            <Table.Tr>
              <Table.Td colSpan={3}>
                <Text>This workspace has no invites</Text>
              </Table.Td>
            </Table.Tr>
          ) : (
            <InviteRow invite={data} workspaceId={workspaceId} />
          )}
        </Table.Tbody>
      </Table>
      {!data ? (
        <Button
          variant={"light"}
          leftSection={
            isCreateInviteLoading ? (
              <Loader color={"white"} size={"xs"} />
            ) : (
              <PlusIcon className={"h-5 w-5"} />
            )
          }
          onClick={() => {
            modals.openConfirmModal({
              title: "Create a new invite?",
              labels: {
                confirm: "Create",
                cancel: "Cancel",
              },
              confirmProps: {
                leftSection: <PlusIcon className={"h-5 w-5"} />,
              },
              onConfirm: () => mutate({ workspaceId }),
            });
          }}
          className={"mt-2"}
        >
          Create an invite
        </Button>
      ) : (
        <Button
          variant={"light"}
          color={"orange"}
          leftSection={<RefreshCcwIcon className={"h-5 w-5"} />}
          onClick={() =>
            modals.openConfirmModal({
              title: "Refresh invite?",
              children:
                "Are you sure you want to refresh this invite? Anyone with the old link cannot join your workspace anymore!",
              labels: {
                confirm: "Refresh",
                cancel: "Cancel",
              },
              confirmProps: {
                leftSection: <RefreshCcwIcon className={"h-5 w-5"} />,
                color: "orange",
              },
              onConfirm: () => regenerateInvite({ inviteId: data.id }),
            })
          }
        >
          Refresh invite
        </Button>
      )}
    </>
  );
};

export const DangerZoneSection = ({
  workspaceId,
  currentUserIsOwner,
}: {
  workspaceId: string;
  currentUserIsOwner?: boolean;
}) => {
  const router = useRouter();
  const { mutate: deleteWorkspace, isLoading: isDeleteWorkspaceLoading } =
    api.workspace.delete.useMutation({
      onSuccess: () => router.push("/workspace"),
    });
  const { mutate: leaveWorkspace, isLoading: isLeaveWorkspaceLoading } =
    api.workspace.leave.useMutation({
      onSuccess: () => router.push("/workspace"),
    });

  return (
    <>
      <Title order={5} className={"mt-5"}>
        Danger zone
      </Title>
      <div
        className={
          "mt-1 flex flex-row items-center justify-between bg-[--mantine-color-red-light] p-3"
        }
      >
        {currentUserIsOwner ? (
          <>
            <div>
              <Title order={6}>Delete this workspace</Title>
              <Text size={"md"}>This action is irreversible!</Text>
            </div>
            <Button
              color={"red"}
              variant={"outline"}
              className={"ml-3"}
              onClick={() =>
                modals.openConfirmModal({
                  title: "Delete workspace?",
                  children: (
                    <Text>
                      Are you sure you want to delete this workspace? This
                      action cannot be undone!
                    </Text>
                  ),
                  onConfirm: () => {
                    deleteWorkspace({ workspaceId });
                    modals.closeAll();
                  },
                  labels: { confirm: "Delete", cancel: "Cancel" },
                  confirmProps: {
                    color: "red",
                    leftSection: isDeleteWorkspaceLoading ? (
                      <Loader size={"xs"} color={"white"} />
                    ) : (
                      <Trash2Icon className={"h-4 w-4"} />
                    ),
                  },
                })
              }
              leftSection={
                isDeleteWorkspaceLoading ? (
                  <Loader size={"xs"} color={"white"} />
                ) : (
                  <Trash2Icon className={"h-4 w-4"} />
                )
              }
            >
              Delete workspace
            </Button>
          </>
        ) : (
          <>
            <div>
              <Title order={6}>Leave this workspace</Title>
              <Text size={"md"}>This action is permanent!</Text>
            </div>
            <Button
              color={"red"}
              variant={"outline"}
              className={"ml-3"}
              onClick={() =>
                modals.openConfirmModal({
                  title: "Leave workspace?",
                  children: (
                    <Text>
                      Are you sure you want to leave this workspace? You&apos;ll
                      have to get a new invite from the workspace owner to
                      rejoin the workspace!
                    </Text>
                  ),
                  onConfirm: () => {
                    leaveWorkspace({ workspaceId });
                    modals.closeAll();
                  },
                  labels: { confirm: "Leave", cancel: "Cancel" },
                  confirmProps: {
                    color: "red",
                    leftSection: isLeaveWorkspaceLoading ? (
                      <Loader size={"xs"} color={"white"} />
                    ) : (
                      <LogOutIcon className={"h-4 w-4"} />
                    ),
                  },
                })
              }
              leftSection={
                isLeaveWorkspaceLoading ? (
                  <Loader size={"xs"} color={"white"} />
                ) : (
                  <LogOutIcon className={"h-4 w-4"} />
                )
              }
            >
              Leave workspace
            </Button>
          </>
        )}
      </div>
    </>
  );
};
