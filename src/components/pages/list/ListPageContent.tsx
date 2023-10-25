import { Button, Image, Loader, Text, Title } from "@mantine/core";
import { ArrowDownWideNarrowIcon, CheckIcon } from "lucide-react";
import { SortableList } from "~/components/pages/list/SortableList";
import { List } from "~/components/pages/list/List";
import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";
import { useState } from "react";

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
  const { mutateAsync, isLoading } = api.list.updatePositions.useMutation({
    onSettled: () => utils.list.getList.invalidate({ listId: list.id }),
  });
  const [updateAmount, setUpdateAmount] = useState(0);

  return (
    <div>
      <div className={"flex justify-between"}>
        <div>
          <Text c={"dimmed"}>List</Text>
          <Title>{list.name}</Title>
        </div>
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
            if (isReordering) {
              if (updateAmount > 0) {
                await mutateAsync({
                  listId: list.id,
                  items: list.items.map(({ id }, index) => ({
                    id,
                    position: index,
                  })),
                });
                setUpdateAmount(0);
              }
            }
            setIsReordering(!isReordering);
          }}
        >
          {isReordering ? "Done" : "Reorder"}
        </Button>
      </div>
      <div className={"mt-4"}>
        {isReordering ? (
          <SortableList
            items={list.items}
            listId={list.id}
            updateAmount={updateAmount}
            setUpdateAmount={setUpdateAmount}
          />
        ) : (
          <List items={list.items} listId={list.id} />
        )}
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
