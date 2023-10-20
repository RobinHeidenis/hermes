import { Card, HoverCard, Text, Title } from "@mantine/core";
import { HelpCircleIcon } from "lucide-react";
import { DefaultWorkspaceForm } from "./DefaultWorkspaceForm";
import type { RouterOutputs } from "~/utils/api";

export const DefaultWorkspaceCard = ({
  workspaces,
  defaultWorkspace,
}: {
  defaultWorkspace: RouterOutputs["user"]["getDefaultWorkspace"] | undefined;
  workspaces: RouterOutputs["workspace"]["getWorkspaces"];
}) => (
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
            This is also the default workspace you get loaded into when logging
            in on the workspaces page.
          </Text>
        </HoverCard.Dropdown>
      </HoverCard>
    </div>
    <DefaultWorkspaceForm
      workspaces={workspaces}
      defaultWorkspaceId={defaultWorkspace?.id}
    />
  </Card>
);
