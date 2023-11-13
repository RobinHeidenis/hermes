import { CustomAppShell } from "~/components/appshell/CustomAppShell";
import { ActionIcon } from "@mantine/core";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import "react-swipeable-list/dist/styles.css";
import { PlusIcon } from "lucide-react";
import { openCreateListItemModal } from "~/components/modals/CreateListItemModal";
import { ListPageContent } from "~/components/pages/list/ListPageContent";
import { useState } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

export const ListPage = withPageAuthRequired(() => {
  const { query } = useRouter();
  const [isReordering, setIsReordering] = useState(false);
  const { data: list } = api.list.getList.useQuery(
    { listId: query.list as string },
    { enabled: !!query.list && !isReordering },
  );

  return (
    <>
      <CustomAppShell>
        <div
          className={
            "flex w-full items-center justify-between sm:justify-center"
          }
        >
          <div className={"w-full sm:w-2/3 md:w-1/2 3xl:w-1/4"}>
            <ListPageContent
              list={list}
              isReordering={isReordering}
              setIsReordering={setIsReordering}
            />
          </div>
        </div>
      </CustomAppShell>
      {!isReordering && (
        <ActionIcon
          radius={"xl"}
          size={"xl"}
          className={"fixed bottom-8 right-8 z-[99]"}
          onClick={() =>
            openCreateListItemModal({ listId: query.list as string })
          }
        >
          <PlusIcon />
        </ActionIcon>
      )}
    </>
  );
});

export default ListPage;
