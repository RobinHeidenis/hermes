import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "~/components/pages/list/SortableItem";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";

export const SortableList = ({
  items,
  listId,
  updateAmount,
  setUpdateAmount,
  forceUpdate,
}: {
  items: RouterOutputs["list"]["getList"]["items"];
  listId: string;
  updateAmount: number;
  setUpdateAmount: (updateAmount: number) => void;
  forceUpdate: () => void;
}) => {
  const showLinkSpace = items.some((i) => i.externalUrl) ?? false;
  const sensors = useSensors(
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const utils = api.useUtils();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const movedItems = arrayMove(
        [...items],
        items.findIndex((item) => item.id === active.id),
        items.findIndex((item) => item.id === over?.id),
      );
      utils.list.getList.setData({ listId }, (data) => {
        if (!data) return data;
        return {
          ...data,
          items: movedItems,
        };
      });
      setUpdateAmount(updateAmount + 1);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((item) => {
          return (
            <SortableItem
              key={item.id}
              item={item}
              showLinkSpace={showLinkSpace}
              listId={listId}
              forceUpdate={forceUpdate}
            />
          );
        })}
      </SortableContext>
    </DndContext>
  );
};
