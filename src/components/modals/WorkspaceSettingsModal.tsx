import { modals } from "@mantine/modals";
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Card,
  Select,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { CheckIcon, Trash2Icon, UserPlusIcon } from "lucide-react";

const WorkspaceSettingsModal = () => {
  return (
    <div className={"flex flex-col"}>
      <Title order={5}>Default list</Title>
      <Select label={"Default list"} />
      <Button
        leftSection={<CheckIcon className={"h-4 w-4"} />}
        className={"mt-5 self-end"}
      >
        Save
      </Button>
      <Title order={5}>Users in this list</Title>
      <Card
        className={"mt-2 flex flex-row items-center justify-between"}
        padding={"xs"}
      >
        <div className={"flex flex-row items-center"}>
          <Avatar
            src={
              "https://cdn.discordapp.com/avatars/174197852182937601/f2eb53afd65c5c8a7ef98ac86d29641e.webp"
            }
            size={"sm"}
            className={"mr-2"}
          />
          <Text>DrFractum</Text>
        </div>
        <Tooltip
          label={"You can't remove yourself from your own list"}
          bg={"dark.5"}
          c={"white"}
        >
          <Badge variant={"light"}>You</Badge>
        </Tooltip>
      </Card>
      <Card
        className={"mt-2 flex flex-row items-center justify-between"}
        padding={"xs"}
      >
        <div className={"flex flex-row items-center"}>
          <Avatar
            src={
              "https://cdn.discordapp.com/avatars/174197852182937601/f2eb53afd65c5c8a7ef98ac86d29641e.webp"
            }
            size={"sm"}
            className={"mr-2"}
          />
          <Text>DrFractum2</Text>
        </div>
        <ActionIcon
          variant={"light"}
          color={"red"}
          onClick={() =>
            modals.openConfirmModal({
              title: "Delete user?",
              children: (
                <div className={"flex flex-col items-center justify-center"}>
                  <Avatar
                    src={
                      "https://cdn.discordapp.com/avatars/174197852182937601/f2eb53afd65c5c8a7ef98ac86d29641e.webp"
                    }
                    size={"xl"}
                    className={"mr-2"}
                  />
                  <Text className={"mt-2"}>DrFractum</Text>
                  <Text className={"mt-5"}>
                    Are you sure you want to remove DrFractum from this list?
                  </Text>
                </div>
              ),
              labels: { confirm: "Delete", cancel: "Cancel" },
              confirmProps: { color: "red" },
            })
          }
        >
          <Trash2Icon className={"h-4 w-4"} />
        </ActionIcon>
      </Card>
      <Button
        variant={"light"}
        leftSection={<UserPlusIcon className={"h-5 w-5"} />}
        className={"mt-2"}
      >
        Invite user
      </Button>
      <Title order={5} className={"mt-5"}>
        Danger zone
      </Title>
      <div
        className={
          "mt-1 flex flex-row items-center justify-between bg-[--mantine-color-red-light] p-3"
        }
      >
        <div>
          <Title order={6}>Permanently delete this workspace</Title>
          <Text size={"md"}>This action is irreversible!</Text>
        </div>
        <Button
          color={"red"}
          variant={"outline"}
          className={"ml-3"}
          leftSection={<Trash2Icon className={"h-4 w-4"} />}
        >
          Delete list
        </Button>
      </div>
    </div>
  );
};

export const openWorkspaceSettingsModal = () => {
  modals.open({
    title: "Workspace settings",
    children: <WorkspaceSettingsModal />,
  });
};
