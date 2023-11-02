import type { PropsWithChildren } from "react";
import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";
import type { DropResult } from "@hello-pangea/dnd";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";

const reorder = (
  list: RouterOutputs["list"]["getList"]["items"],
  startIndex: number,
  endIndex: number,
) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);

  if (!removed) return result;

  result.splice(endIndex, 0, removed);

  return result;
};

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
  const utils = api.useUtils();

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    if (result.destination.index === result.source.index) return;

    const movedItems = reorder(
      [...items],
      result.source.index,
      result.destination.index,
    );

    utils.list.getList.setData({ listId }, (data) => {
      if (!data) return data;
      return {
        ...data,
        items: movedItems,
      };
    });
    setUpdateAmount(updateAmount + 1);
  };
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId={"list"}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {children}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
