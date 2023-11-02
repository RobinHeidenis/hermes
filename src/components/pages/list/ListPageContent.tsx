import { Button, Image, Loader, Text, Title } from "@mantine/core";
import { ArrowDownWideNarrowIcon, CheckIcon } from "lucide-react";
import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";
import { useState } from "react";
import { useForceUpdate } from "@mantine/hooks";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { UnifiedList } from "~/components/pages/list/UnifiedList";
import { ListMenu } from "~/components/pages/list/ListMenu";
import { useUser } from "@auth0/nextjs-auth0/client";

export const ListPageContent = ({
  list,
  isReordering,
  setIsReordering,
}: {
  list: RouterOutputs["list"]["getList"];
  isReordering: boolean;
  setIsReordering: (isReordering: boolean) => void;
}) => {
  const utils = api.useUtils();
  const { user } = useUser();
  const { mutateAsync, isLoading } = api.list.updatePositions.useMutation({
    onSettled: () => utils.list.getList.invalidate({ listId: list.id }),
  });
  const [updateAmount, setUpdateAmount] = useState(0);
  const forceUpdate = useForceUpdate();
  const [ref] = useAutoAnimate();

  return (
    <div>
      <div className={"flex justify-between"}>
        <div>
          <Text c={"dimmed"}>List</Text>
          <Title>{list.name}</Title>
        </div>
        <div className={"flex"}>
          <Button
            variant={"light"}
            leftSection={
              isReordering ? (
                isLoading ? (
                  <Loader color={"blue"} size={"xs"} />
                ) : (
                  <CheckIcon />
                )
              ) : (
                <ArrowDownWideNarrowIcon />
              )
            }
            onClick={async () => {
              if (isReordering && updateAmount > 0) {
                await mutateAsync({
                  listId: list.id,
                  items: list.items.map(({ id }, index) => ({
                    id,
                    position: index,
                  })),
                });
                setUpdateAmount(0);
              }
              setIsReordering(!isReordering);
            }}
          >
            {isReordering ? "Done" : "Reorder"}
          </Button>
          <ListMenu
            listId={list.id}
            items={list.items.length > 0}
            checkedItems={list.items.filter((i) => i.checked).length > 0}
            workspaceId={list.workspaceId}
            currentUserIsOwner={user?.sub === list.workspace.ownerId}
          />
        </div>
      </div>
      <div className={"mt-4"} ref={ref}>
        <UnifiedList
          items={list.items}
          listId={list.id}
          updateAmount={updateAmount}
          setUpdateAmount={setUpdateAmount}
          forceUpdate={forceUpdate}
          isReordering={isReordering}
        />
      </div>
      {list.items.length === 0 && (
        <div className={"mt-10 flex flex-col items-center"}>
          <Image
            src={"/no_data.svg"}
            alt={"No data illustration"}
            className={"h-80 w-80"}
          />
          <Title order={3} className={"mt-12"}>
            No items
          </Title>
          <Text className={"mt-5 text-center"}>
            This list is empty. Add items by clicking the plus button
          </Text>
        </div>
      )}
    </div>
  );
};
