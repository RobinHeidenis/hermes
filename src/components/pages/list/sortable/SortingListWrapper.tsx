import type { PropsWithChildren } from "react";
import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";

export const SortingListWrapper = ({
  items,
  children,
  listId,
  setUpdateAmount,
  updateAmount,
}: PropsWithChildren<{
  items: RouterOutputs["list"]["getList"]["items"];
  listId: string;
  setUpdateAmount: (updateAmount: number) => void;
  updateAmount: number;
}>) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
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
        {children}
      </SortableContext>
    </DndContext>
  );
};
