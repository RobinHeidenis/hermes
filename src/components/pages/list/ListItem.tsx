import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";
import {
  LeadingActions,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
} from "react-swipeable-list";
import {
  CheckIcon,
  GripVerticalIcon,
  LinkIcon,
  TrashIcon,
  UndoIcon,
} from "lucide-react";
import { ActionIcon, Card, Loader, Text } from "@mantine/core";
import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

type ListItem = RouterOutputs["list"]["getList"]["items"][number];

export interface ListItemProps {
  item: ListItem;
  showLinkSpace?: boolean;
  listId: string;
  attributes?: DraggableAttributes;
  listeners?: SyntheticListenerMap | undefined;
  sortable?: boolean;
  disableSwipe?: boolean;
}

export const ListItem = ({
  item,
  showLinkSpace,
  listId,
  attributes,
  listeners,
  sortable,
  disableSwipe,
}: ListItemProps) => {
  const { id: itemId, name, price, quantity, checked, externalUrl } = item;
  const utils = api.useContext();
  const { mutate: setItemChecked } = api.item.setItemChecked.useMutation({
    onMutate: async (checkedItem) => {
      await utils.list.getList.cancel({ listId });
      const previousList = utils.list.getList.getData({ listId });
      utils.list.getList.setData({ listId }, (data) => {
        if (!data) return data;
        const updatedItems = data.items.map((i) =>
          i.id === checkedItem.itemId
            ? { ...i, checked: checkedItem.checked }
            : i,
        );
        return { ...data, items: updatedItems };
      });

      return { previousList, checkedItem };
    },
    onError: (_error, _list, context) => {
      utils.list.getList.setData({ listId }, context?.previousList);
    },
    onSettled: () => utils.list.getList.invalidate({ listId }),
  });
  const { mutate: deleteItem } = api.item.deleteItem.useMutation({
    onSuccess: () => {
      utils.list.getList.setData({ listId }, (data) => {
        if (!data) return data;

        const updatedItems = data.items.filter((i) => i.id !== itemId);

        return { ...data, items: updatedItems };
      });
    },
  });
  const formatter = new Intl.NumberFormat(undefined, {
    currency: "EUR",
    style: "currency",
  });
  const isTempItem = itemId === "temp";
  const itemChecked = checked && !sortable;

  return (
    <SwipeableListItem
      maxSwipe={1}
      threshold={0.2}
      className={"mb-2"}
      blockSwipe={isTempItem || disableSwipe}
      leadingActions={
        <LeadingActions>
          <SwipeAction
            onClick={() => {
              setItemChecked({ itemId, listId, checked: !checked });
            }}
          >
            <div
              className={`flex h-full flex-col !justify-center ${
                itemChecked ? "bg-yellow-700" : "bg-green-800"
              } pl-5`}
            >
              <div className={"flex w-fit flex-col items-center"}>
                {itemChecked ? <UndoIcon /> : <CheckIcon />}
                {itemChecked ? "Undo" : "Check"}
              </div>
            </div>
          </SwipeAction>
        </LeadingActions>
      }
      trailingActions={
        <TrailingActions>
          <SwipeAction
            destructive
            onClick={() => {
              deleteItem({ itemId, listId });
            }}
          >
            <div
              className={
                "flex h-full flex-col items-end !justify-center bg-red-700 pr-5"
              }
            >
              <div className={"flex w-fit flex-col items-center"}>
                <TrashIcon />
                Delete
              </div>
            </div>
          </SwipeAction>
        </TrailingActions>
      }
    >
      <Card
        className={"flex w-full flex-row justify-between"}
        bg={isTempItem ? "dark.4" : itemChecked ? "dark.8" : "dark.6"}
      >
        <div className={"flex flex-row items-center"}>
          {(isTempItem || showLinkSpace) && (
            <>
              {isTempItem ? (
                <Loader color={"white"} size={"xs"} className={"mr-5"} />
              ) : externalUrl ? (
                <a href={externalUrl} target={"_blank"}>
                  <ActionIcon
                    variant={"transparent"}
                    color={"gray"}
                    className={"mr-3"}
                  >
                    <LinkIcon className={"h-4 w-4"} />
                  </ActionIcon>
                </a>
              ) : (
                <div className={"mr-10"} />
              )}
            </>
          )}
          <div className={"flex flex-col"}>
            <Text td={itemChecked ? "line-through" : ""}>{name}</Text>
            <Text c={"dimmed"}>{quantity}</Text>
          </div>
        </div>
        <div className={"flex items-center"}>
          {price !== null && (
            <Text fw={500}>{formatter.format(parseFloat(price))}</Text>
          )}
          {sortable && (
            <GripVerticalIcon
              className={"ml-5 cursor-move"}
              {...attributes}
              {...listeners}
            />
          )}
        </div>
      </Card>
    </SwipeableListItem>
  );
};
