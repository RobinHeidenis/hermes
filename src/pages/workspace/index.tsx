import { CustomAppShell } from "~/components/appshell/CustomAppShell";
import { Button, Flex, Text, Title } from "@mantine/core";
import { WorkspaceCard } from "~/components/pages/workspace/WorkspaceCard";
import { PlusIcon, ShieldIcon, UsersIcon } from "lucide-react";
import { api } from "~/utils/api";
import { SkeletonWorkspaceCard } from "~/components/pages/workspace/SkeletonWorkspaceCard";
import type { ComponentType, ReactNode } from "react";
import { openCreateWorkspaceModal } from "~/components/modals/CreateWorkspaceModal";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Icon } from "~/components/Icon";

export const WorkspaceIndex = withPageAuthRequired(() => {
  const { data, isLoading } = api.workspace.getWorkspaces.useQuery();

  return (
    <CustomAppShell>
      <div className={"flex items-center justify-between"}>
        <div>
          <Text c={"dimmed"}>Overview</Text>
          <Title style={{ viewTransitionName: `workspace-header` }}>
            Workspaces
          </Title>
        </div>
        <Button
          variant={"light"}
          className={"self-start"}
          leftSection={<PlusIcon className={"h-5 w-5"} />}
          onClick={openCreateWorkspaceModal}
        >
          <Text hiddenFrom={"sm"} size={"sm"} fw={700}>
            New
          </Text>
          <Text visibleFrom={"sm"} size={"sm"} fw={700}>
            New workspace
          </Text>
        </Button>
      </div>
      <div className={"mt-5 flex items-center justify-center md:justify-start"}>
        <Icon
          IconComponent={ShieldIcon}
          className={"mr-2"}
          firefoxMarginClass={"mb-2"}
        />
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
        <Icon
          IconComponent={UsersIcon}
          className={"mr-2"}
          firefoxMarginClass={"mb-2"}
        />
        <Title order={2} visibleFrom={"sm"}>
          Contributing workspaces
        </Title>
        <Title order={2} hiddenFrom={"sm"}>
          Contributing
        </Title>
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
