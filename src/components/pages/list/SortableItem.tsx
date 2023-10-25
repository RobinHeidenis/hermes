import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ListItemProps } from "~/components/pages/list/ListItem";
import { ListItem } from "~/components/pages/list/ListItem";

export const SortableItem = ({
  item,
  showLinkSpace,
  listId,
}: ListItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <ListItem
        item={item}
        showLinkSpace={showLinkSpace}
        listId={listId}
        attributes={attributes}
        listeners={listeners}
        sortable
        disableSwipe
      />
    </div>
  );
};
