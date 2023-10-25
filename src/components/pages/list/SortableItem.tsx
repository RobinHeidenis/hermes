import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ListItemProps } from "~/components/pages/list/ListItem";
import { ListItem } from "~/components/pages/list/ListItem";

export const SortableItem = ({
  item,
  showLinkSpace,
  listId,
  forceUpdate,
}: ListItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <ListItem
        item={item}
        showLinkSpace={showLinkSpace}
        listId={listId}
        forceUpdate={forceUpdate}
        attributes={attributes}
        listeners={listeners}
        sortable
        disableSwipe
      />
    </div>
  );
};
