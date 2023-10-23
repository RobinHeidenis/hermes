import { api } from "~/utils/api";
import {
  LeadingActions,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
} from "react-swipeable-list";
import { CheckIcon, LinkIcon, TrashIcon, UndoIcon } from "lucide-react";
import { ActionIcon, Card, Text } from "@mantine/core";

interface ListItemProps {
  itemId: string;
  name: string;
  price: string | null;
  quantity: string | null;
  checked: boolean;
  externalUrl: string | null;
  showLinkSpace?: boolean;
  listId: string;
}

export const ListItem = ({
  itemId,
  name,
  price,
  quantity,
  checked,
  externalUrl,
  showLinkSpace,
  listId,
}: ListItemProps) => {
  const utils = api.useContext();
  const { mutate } = api.item.setItemChecked.useMutation({
    onSuccess: (item) => {
      if (!item) return;

      utils.list.getList.setData({ listId }, (data) => {
        if (!data) return data;

        const updatedItems = data.items.map((i) =>
          i.id === item.id ? { ...i, checked: item.checked } : i,
        );

        return { ...data, items: updatedItems };
      });
    },
  });
  const formatter = new Intl.NumberFormat(undefined, {
    currency: "EUR",
    style: "currency",
  });

  return (
    <SwipeableListItem
      maxSwipe={1}
      threshold={0.2}
      className={"mb-2"}
      leadingActions={
        <LeadingActions>
          <SwipeAction
            onClick={() => {
              mutate({ itemId, listId, checked: !checked });
            }}
          >
            <div
              className={`flex h-full flex-col !justify-center ${
                checked ? "bg-yellow-700" : "bg-green-800"
              } pl-5`}
            >
              <div className={"flex w-fit flex-col items-center"}>
                {checked ? <UndoIcon /> : <CheckIcon />}
                {checked ? "Undo" : "Check"}
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
              console.log("swiped right");
            }}
          >
            <div
              className={"flex h-full flex-col !justify-center bg-red-700 pl-5"}
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
        bg={checked ? "dark.8" : "dark.6"}
      >
        <div className={"flex flex-row items-center"}>
          {showLinkSpace && (
            <>
              {externalUrl ? (
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
            <Text td={checked ? "line-through" : ""}>{name}</Text>
            <Text c={"dimmed"}>{quantity}</Text>
          </div>
        </div>
        {price && (
          <div className={"flex items-center"}>
            <Text fw={500}>{formatter.format(parseInt(price))}</Text>
          </div>
        )}
      </Card>
    </SwipeableListItem>
  );
};
