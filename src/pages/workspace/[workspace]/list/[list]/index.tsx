import { CustomAppShell } from "~/components/appshell/CustomAppShell";
import { Skeleton, Text, Title } from "@mantine/core";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import "react-swipeable-list/dist/styles.css";
import { List } from "~/components/pages/list/List";

export const ListPage = () => {
  const { query } = useRouter();
  const { data: list, isLoading } = api.list.getList.useQuery(
    { listId: query.list as string },
    { enabled: !!query.list },
  );

  return (
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
            </div>
          )}
        </div>
      </div>
    </CustomAppShell>
  );
};

export default ListPage;
