// page that shows all workspaces

import { CustomAppShell } from "~/components/appshell/CustomAppShell";
import { Flex, Title } from "@mantine/core";
import { WorkspaceCard } from "~/components/workspace/WorkspaceCard";
import { ShieldIcon, UsersIcon } from "lucide-react";

export const WorkspaceIndex = () => {
  return (
    <CustomAppShell>
      <Title>Workspace Index</Title>
      <div className={"mt-10 flex items-center"}>
        <ShieldIcon className={"mr-2"} />
        <Title order={2}>My workspaces</Title>
      </div>
      <Flex gap={30} className={"mt-5 flex-wrap"}>
        <WorkspaceCard
          id={"2585f873-2021-4794-b00b-07d92ab9c3f6"}
          name={"Workspace 1"}
          users={1}
          lists={3}
        />
        <WorkspaceCard
          id={"4cf99a13-a66e-4b91-b6d7-6b37d86bb40c"}
          name={"Workspace 2"}
          users={5}
          lists={1}
        />
        <WorkspaceCard
          id={"1a6a68a3-1024-4758-97c4-6e60ef00cb79"}
          name={"Workspace 2"}
          users={5}
          lists={1}
        />
        <WorkspaceCard
          id={"3a97d69a-8310-40cf-9871-1c9ca46abcc9"}
          name={"Workspace 2"}
          users={5}
          lists={1}
        />
        <WorkspaceCard
          id={"1aa4929f-8a36-4e66-a4b8-a58a431eb086"}
          name={
            "My super mega cooooooool awesome gamer list that is absolutely cool"
          }
          users={12}
          lists={14}
        />
      </Flex>
      <div className={"mt-5 flex items-center"}>
        <UsersIcon className={"mr-2"} />
        <Title order={2}>Contributing workspaces</Title>
      </div>
      <Flex gap={30} className={"mt-3 flex-wrap"}>
        <WorkspaceCard
          id={"a17391c0-a10b-4e58-a8f7-59cadc6889c1"}
          name={"Workspace 1"}
          users={1}
          lists={3}
        />
        <WorkspaceCard
          id={"f448f27b-2952-48ad-8f23-4333c9c7825d"}
          name={"Workspace 2"}
          users={5}
          lists={1}
        />
        <WorkspaceCard
          id={"56c0c5ba-a03e-431d-9974-87213a29d964"}
          name={
            "My super mega cooooooool awesome gamer list that is absolutely cool and not cringe at all"
          }
          users={12}
          lists={14}
        />
      </Flex>
    </CustomAppShell>
  );
};

export default WorkspaceIndex;
