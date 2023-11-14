import {
  ActionIcon,
  Button,
  Card,
  Image,
  Loader,
  Skeleton,
  Text,
  Title,
} from "@mantine/core";
import {
  CheckIcon,
  CreditCardIcon,
  MoreVerticalIcon,
  PencilIcon,
} from "lucide-react";
import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";
import { useEffect, useState } from "react";
import { useForceUpdate } from "@mantine/hooks";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { UnifiedList } from "~/components/pages/list/UnifiedList";
import { ListMenu } from "~/components/pages/list/ListMenu";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";
import { openLoyaltyCardModal } from "~/components/modals/LoyaltyCardModal";
import { modals } from "@mantine/modals";

export const ListPageContent = ({
  list,
  isReordering,
  setIsReordering,
}: {
  list: RouterOutputs["list"]["getList"] | undefined;
  isReordering: boolean;
  setIsReordering: (isReordering: boolean) => void;
}) => {
  const router = useRouter();
  const utils = api.useUtils();
  const { user } = useUser();

  const [updateAmount, setUpdateAmount] = useState(0);
  const forceUpdate = useForceUpdate();
  const [ref] = useAutoAnimate();

  const { mutateAsync, isLoading } = api.list.updatePositions.useMutation({
    onSettled: () =>
      utils.list.getList.invalidate({ listId: router.query.list as string }),
  });

  const basicListData =
    utils.workspace.getWorkspace
      .getData({ workspaceId: router.query.workspace as string })
      ?.lists.filter((l) => l.id === router.query.list)[0] ?? undefined;
  const listId = list?.id ?? basicListData?.id ?? (router.query.list as string);

  useEffect(() => {
    const hash = router.asPath.split("#")[1];
    if (hash === "loyaltyCard") {
      if (!list ?? !list?.defaultLoyaltyCard) return;
      openLoyaltyCardModal({
        card: list.defaultLoyaltyCard,
        workspaceId: list.workspaceId,
        onClose: () => {
          void router.replace(
            {
              href: router.asPath.split("#")[0],
              query: router.query,
              hash: null,
            },
            undefined,
            { shallow: true },
          );
        },
      });
      return;
    }
    modals.closeAll();
  }, [router.asPath, list, router]);

  return (
    <div>
      <div className={"flex justify-between"}>
        <div>
          <Text
            c={"dimmed"}
            style={{
              viewTransitionName: `list-header`,
            }}
          >
            List
          </Text>
          <Title
            style={{
              viewTransitionName: `list-title-${listId}`,
            }}
          >
            {list?.name ?? basicListData?.name ?? (
              <Skeleton className={"mt-1 h-10 w-40"} />
            )}
          </Title>
        </div>
        <div className={"flex"}>
          {isReordering ? (
            <Button
              variant={"light"}
              leftSection={
                isLoading ? (
                  <Loader color={"blue"} size={"xs"} />
                ) : (
                  <CheckIcon />
                )
              }
              onClick={async () => {
                if (updateAmount > 0) {
                  await mutateAsync({
                    listId: listId,
                    items:
                      list?.items.map(({ id }, index) => ({
                        id,
                        position: index,
                      })) ?? [],
                  });
                  setUpdateAmount(0);
                }
                setIsReordering(!isReordering);
              }}
            >
              Done
            </Button>
          ) : (
            list?.defaultLoyaltyCard && (
              <Button
                variant={"light"}
                color={"green"}
                leftSection={<CreditCardIcon className={"h-4 w-4"} />}
                onClick={() =>
                  router.push({
                    hash: "loyaltyCard",
                  })
                }
              >
                Store card
              </Button>
            )
          )}
          {list ? (
            <ListMenu
              listId={list.id}
              items={list.items.length > 0}
              checkedItems={list.items.filter((i) => i.checked).length > 0}
              workspaceId={list.workspaceId}
              currentUserIsOwner={user?.sub === list.workspace.ownerId}
              setIsReordering={setIsReordering}
            />
          ) : (
            <ActionIcon
              variant={"subtle"}
              color={"dark"}
              size={"lg"}
              className={"ml-3"}
            >
              <MoreVerticalIcon className={"h-4 w-4"} />
            </ActionIcon>
          )}
        </div>
      </div>
      {list?.items.length === 0 ? (
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
      ) : (
        <div className={"mt-4"} ref={ref}>
          {list ? (
            <UnifiedList
              items={list.items}
              listId={list.id}
              updateAmount={updateAmount}
              setUpdateAmount={setUpdateAmount}
              forceUpdate={forceUpdate}
              isReordering={isReordering}
            />
          ) : (
            <>
              <ListItemCardSkeleton />
              <ListItemCardSkeleton />
              <ListItemCardSkeleton />
            </>
          )}
        </div>
      )}
    </div>
  );
};

const ListItemCardSkeleton = () => (
  <Card bg={"dark.6"} className={"mb-2 flex flex-row justify-between"}>
    <div className={"flex flex-row items-center"}>
      <div className={`flex flex-col`}>
        <Skeleton className={"h-4 w-32"}></Skeleton>
      </div>
    </div>
    <div className={"flex items-center"}>
      <Skeleton className={"h-4 w-12"} />
      <ActionIcon
        variant={"transparent"}
        color={"dark"}
        disabled
        className={"ml-3"}
      >
        <PencilIcon className={"h-4 w-4"} />
      </ActionIcon>
    </div>
  </Card>
);
