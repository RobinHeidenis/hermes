import type { RouterOutputs } from "~/utils/api";
import type { DraggableAttributes } from "@dnd-kit/core";
import { CheckIcon, Title } from "@mantine/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { SortingListWrapper } from "~/components/pages/list/sortable/SortingListWrapper";
import { SwipeableListWrapper } from "~/components/pages/list/swipeable/SwipeableListWrapper";
import { SwipeableListItem } from "~/components/pages/list/swipeable/SwipeableListItem";
import { SortableListItem } from "~/components/pages/list/sortable/SortableListItem";

type ListItem = RouterOutputs["list"]["getList"]["items"][number];

export interface ListItemProps {
  item: ListItem;
  showLinkSpace?: boolean;
  listId: string;
  forceUpdate: () => void;
  attributes?: DraggableAttributes;
  listeners?: SyntheticListenerMap | undefined;
  sortable?: boolean;
  disableSwipe?: boolean;
}

export const UnifiedList = ({
  items,
  listId,
  updateAmount,
  setUpdateAmount,
  forceUpdate,
  isReordering,
}: {
  items: RouterOutputs["list"]["getList"]["items"];
  listId: string;
  updateAmount: number;
  setUpdateAmount: (updateAmount: number) => void;
  forceUpdate: () => void;
  isReordering: boolean;
}) => {
  const showLinkSpace = items.some((i) => i.externalUrl) ?? false;
  const checkedItems = items.filter((i) => i.checked);
  const uncheckedItems = items.filter((i) => !i.checked);

  if (isReordering) {
    return (
      <SortingListWrapper
        items={items}
        listId={listId}
        setUpdateAmount={setUpdateAmount}
        updateAmount={updateAmount}
      >
        {items.map((item) => {
          return (
            <SortableListItem
              key={item.id}
              item={item}
              showLinkSpace={showLinkSpace}
              listId={listId}
              forceUpdate={forceUpdate}
            />
          );
        })}
      </SortingListWrapper>
    );
  } else {
    return (
      <SwipeableListWrapper>
        {uncheckedItems.map((item) => (
          <SwipeableListItem
            key={item.id}
            item={item}
            showLinkSpace={showLinkSpace}
            listId={listId}
            forceUpdate={forceUpdate}
          />
        ))}
        {checkedItems.length > 0 && (
          <div className={"flex items-center py-2"}>
            <CheckIcon className={"mr-2 h-5 w-5"} />
            <Title order={4}>Checked items</Title>
          </div>
        )}
        {checkedItems.map((item) => (
          <SwipeableListItem
            key={item.id}
            item={item}
            showLinkSpace={showLinkSpace}
            listId={listId}
            forceUpdate={forceUpdate}
          />
        ))}
      </SwipeableListWrapper>
    );
  }
};
