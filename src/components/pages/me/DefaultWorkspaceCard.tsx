import {
  Button,
  Card,
  HoverCard,
  Loader,
  Select,
  Text,
  Title,
} from "@mantine/core";
import { CheckIcon, HelpCircleIcon } from "lucide-react";
import { DefaultWorkspaceForm } from "./DefaultWorkspaceForm";
import { api } from "~/utils/api";

export const DefaultWorkspaceCard = () => {
  const { data: defaultWorkspace, isLoading: isGetDefaultWorkspaceLoading } =
    api.user.getDefaultWorkspace.useQuery();
  const { data: workspaces, isLoading: isGetWorkspacesLoading } =
    api.workspace.getWorkspaces.useQuery();

  return (
    <Card className={"mt-5"}>
      <div className={"flex items-center"}>
        <Title order={5}>Default workspace</Title>
        <HoverCard withArrow position={"top"}>
          <HoverCard.Target>
            <HelpCircleIcon className={"ml-2 h-4 w-4"} />
          </HoverCard.Target>

          <HoverCard.Dropdown w={"24rem"}>
            <Text>
              The workspace that is used by default when taking actions, such as
              creating a list through the command menu.
            </Text>
            <Text className={"mt-4"}>
              This is also the default workspace you get loaded into when
              logging in on the workspaces page.
            </Text>
          </HoverCard.Dropdown>
        </HoverCard>
      </div>
      {workspaces &&
      !isGetDefaultWorkspaceLoading &&
      !isGetWorkspacesLoading ? (
        <DefaultWorkspaceForm
          workspaces={workspaces}
          defaultWorkspaceId={defaultWorkspace?.id}
        />
      ) : (
        <div className={"mt-3 flex flex-col"}>
          <Select
            leftSection={<Loader color={"dark"} size={"xs"} />}
            placeholder={"None"}
          />
          <Button
            className={"mt-5 w-24 self-end"}
            leftSection={<CheckIcon />}
            disabled
          >
            Save
          </Button>
        </div>
      )}
    </Card>
  );
};
