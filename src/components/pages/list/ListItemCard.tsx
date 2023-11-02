import { ActionIcon, Card, Loader, Text } from "@mantine/core";
import { GripVerticalIcon, LinkIcon, PencilIcon } from "lucide-react";
import { openEditItemModal } from "~/components/modals/EditItemModal";
import type { RouterOutputs } from "~/utils/api";
import type { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";

type ListItem = RouterOutputs["list"]["getList"]["items"][number];

export const ListItemCard = ({
  itemChecked,
  item,
  listId,
  sortable,
  showLinkSpace,
  forceUpdate,
  handleProps,
}: {
  itemChecked?: boolean;
  item: ListItem;
  listId: string;
  sortable?: boolean;
  showLinkSpace?: boolean;
  forceUpdate: () => void;
  handleProps?: DraggableProvidedDragHandleProps | null | undefined;
}) => {
  const formatter = new Intl.NumberFormat(undefined, {
    currency: "EUR",
    style: "currency",
  });
  const isTempItem = item.id === "temp";

  return (
    <Card
      className={"flex w-full flex-row justify-between"}
      bg={isTempItem ? "dark.4" : itemChecked ? "dark.8" : "dark.6"}
    >
      <div className={"flex flex-row items-center"}>
        {isTempItem ? (
          <Loader color={"white"} size={"xs"} className={"mr-5"} />
        ) : (
          item.externalUrl && (
            <a href={item.externalUrl} target={"_blank"} tabIndex={-1}>
              <ActionIcon
                variant={"transparent"}
                color={"gray"}
                className={"mr-3"}
              >
                <LinkIcon className={"h-4 w-4"} />
              </ActionIcon>
            </a>
          )
        )}
        <div className={`flex flex-col ${showLinkSpace && "first:ml-10"}`}>
          <Text td={itemChecked ? "line-through" : ""}>{item.name}</Text>
          <Text c={"dimmed"}>{item.quantity}</Text>
        </div>
      </div>
      <div className={"flex items-center"}>
        {item.price !== null && (
          <Text fw={500}>{formatter.format(parseFloat(item.price))}</Text>
        )}
        {sortable ? (
          <div {...handleProps}>
            <GripVerticalIcon className={"ml-5 cursor-move touch-none"} />
          </div>
        ) : (
          <ActionIcon
            variant={"transparent"}
            color={"white"}
            className={"ml-3"}
            onClick={() =>
              openEditItemModal({ listId, itemId: item.id, forceUpdate })
            }
          >
            <PencilIcon className={"h-4 w-4"} />
          </ActionIcon>
        )}
      </div>
    </Card>
  );
};
