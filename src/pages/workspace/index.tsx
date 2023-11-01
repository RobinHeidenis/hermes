import { CustomAppShell } from "~/components/appshell/CustomAppShell";
import { Button, Flex, Text, Title } from "@mantine/core";
import { WorkspaceCard } from "~/components/pages/workspace/WorkspaceCard";
import { PlusIcon, ShieldIcon, UsersIcon } from "lucide-react";
import { api } from "~/utils/api";
import { SkeletonWorkspaceCard } from "~/components/pages/workspace/SkeletonWorkspaceCard";
import type { ComponentType, ReactNode } from "react";
import { openCreateWorkspaceModal } from "~/components/modals/CreateWorkspaceModal";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

export const WorkspaceIndex = withPageAuthRequired(() => {
  const { data, isLoading } = api.workspace.getWorkspaces.useQuery();

  return (
    <CustomAppShell>
      <div className={"flex items-center justify-between"}>
        <div>
          <Text c={"dimmed"}>Overview</Text>
          <Title>Workspaces</Title>
        </div>
        <Button
          variant={"light"}
          className={"self-start"}
          leftSection={<PlusIcon className={"h-5 w-5"} />}
          onClick={openCreateWorkspaceModal}
        >
          New workspace
        </Button>
      </div>
      <div className={"mt-5 flex items-center justify-center md:justify-start"}>
        <ShieldIcon className={"mr-2"} />
        <Title order={2}>My workspaces</Title>
      </div>
      <Flex
        gap={30}
        className={"mt-5 flex-wrap justify-center md:justify-start"}
      >
        <ArrayDataDisplay
          skeleton={<WorkspaceSkeletons />}
          noItems={<Text>You don&apos;t own any workspaces</Text>}
          data={data}
          isLoading={isLoading}
          array={data?.ownedWorkspaces}
          DisplayElement={WorkspaceCard}
        />
      </Flex>
      <div className={"mt-5 flex items-center justify-center md:justify-start"}>
        <UsersIcon className={"mr-2"} />
        <Title order={2}>Contributing workspaces</Title>
      </div>
      <Flex
        gap={30}
        className={"mt-3 flex-wrap justify-center md:justify-start"}
      >
        <ArrayDataDisplay
          skeleton={<WorkspaceSkeletons />}
          noItems={<Text>You&apos;re not part of any workspaces</Text>}
          data={data}
          isLoading={isLoading}
          array={data?.collaboratingWorkspaces}
          DisplayElement={WorkspaceCard}
        />
      </Flex>
    </CustomAppShell>
  );
});

interface ArrayDataDisplayProps<T extends Array<{ id: string }>, R> {
  skeleton: ReactNode;
  noItems: ReactNode;
  data: R;
  isLoading: boolean;
  array: T | undefined | null;
  DisplayElement: ComponentType<T[number]>;
}
export const ArrayDataDisplay = <T extends Array<{ id: string }>, R>({
  skeleton,
  noItems,
  data,
  array,
  DisplayElement,
  isLoading,
}: ArrayDataDisplayProps<T, R>) => {
  if (isLoading) return skeleton;
  if (!data || !array || array.length === 0) return noItems;
  return array.map((item) => <DisplayElement {...item} key={item.id} />);
};

export default WorkspaceIndex;

export const WorkspaceSkeletons = () => (
  <>
    <SkeletonWorkspaceCard />
    <SkeletonWorkspaceCard />
    <SkeletonWorkspaceCard />
  </>
);
