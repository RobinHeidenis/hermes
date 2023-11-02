import type { ListItemProps } from "~/components/pages/list/UnifiedList";
import { ListItemCard } from "~/components/pages/list/ListItemCard";
import { Draggable } from "@hello-pangea/dnd";

export const SortableListItem = ({
  item,
  showLinkSpace,
  listId,
  forceUpdate,
  index,
}: ListItemProps & { index: number }) => {
  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={"mb-2"}
        >
          <ListItemCard
            listId={listId}
            item={item}
            showLinkSpace={showLinkSpace}
            sortable
            forceUpdate={forceUpdate}
            handleProps={provided.dragHandleProps}
          />
        </div>
      )}
    </Draggable>
  );
};
