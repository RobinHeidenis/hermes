import { SwipeableListItem as ReactSwipeableListItem } from "react-swipeable-list";
import { ListItemCard } from "~/components/pages/list/ListItemCard";
import type { ListItemProps } from "~/components/pages/list/UnifiedList";
import { RightActions } from "~/components/pages/list/swipeable/RightActions";
import { LeftActions } from "~/components/pages/list/swipeable/LeftActions";

export const SwipeableListItem = ({
  item,
  showLinkSpace,
  listId,
  forceUpdate,
  disableSwipe,
}: ListItemProps) => {
  const { id: itemId, checked } = item;

  return (
    <ReactSwipeableListItem
      maxSwipe={1}
      threshold={0.2}
      className={"mb-2"}
      blockSwipe={itemId === "temp" || disableSwipe}
      leadingActions={
        <LeftActions
          itemChecked={checked ?? false}
          listId={listId}
          itemId={itemId}
        />
      }
      trailingActions={<RightActions listId={listId} itemId={itemId} />}
    >
      <ListItemCard
        item={item}
        listId={listId}
        forceUpdate={forceUpdate}
        itemChecked={checked ?? false}
        showLinkSpace={showLinkSpace}
      />
    </ReactSwipeableListItem>
  );
};
