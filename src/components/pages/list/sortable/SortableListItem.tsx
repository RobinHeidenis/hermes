import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ListItemProps } from "~/components/pages/list/UnifiedList";
import { ListItemCard } from "~/components/pages/list/ListItemCard";

export const SortableListItem = ({
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
    <div ref={setNodeRef} style={style} className={"mb-2"}>
      <ListItemCard
        listId={listId}
        item={item}
        showLinkSpace={showLinkSpace}
        sortable
        forceUpdate={forceUpdate}
        attributes={attributes}
        listeners={listeners}
      />
    </div>
  );
};
