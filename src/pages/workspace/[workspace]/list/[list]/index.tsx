import { CustomAppShell } from "~/components/appshell/CustomAppShell";
import { ActionIcon, Image, Skeleton, Text, Title } from "@mantine/core";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import "react-swipeable-list/dist/styles.css";
import { List } from "~/components/pages/list/List";
import { PlusIcon } from "lucide-react";
import { openCreateListItemModal } from "~/components/modals/CreateListItemModal";

export const ListPage = () => {
  const { query } = useRouter();
  const { data: list, isLoading } = api.list.getList.useQuery(
    { listId: query.list as string },
    { enabled: !!query.list },
  );

  return (
    <>
      <CustomAppShell>
        <div className={"flex w-full items-center justify-between"}>
          <div className={"w-full"}>
            <Text c={"dimmed"}>List</Text>
            {isLoading || !list ? (
              <Skeleton className={"mt-2 h-8 w-44"} />
            ) : (
              <div className={"overflow-y-hidden"}>
                <Title>{list.name}</Title>
                <List items={list.items} listId={list.id} />
                {list.items.length === 0 && (
                  <div className={"mt-10 flex flex-col items-center"}>
                    <Image
                      src={"/no_data.svg"}
                      alt={"No data illustration"}
                      className={"h-1/2 w-1/2"}
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
            )}
          </div>
        </div>
      </CustomAppShell>
      <ActionIcon
        radius={"xl"}
        size={"xl"}
        className={"absolute bottom-8 right-8 z-[200]"}
        onClick={() =>
          openCreateListItemModal({ listId: query.list as string })
        }
      >
        <PlusIcon />
      </ActionIcon>
    </>
  );
};

export default ListPage;
