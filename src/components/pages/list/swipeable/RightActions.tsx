import { api } from "~/utils/api";
import { SwipeAction, TrailingActions } from "react-swipeable-list";
import { TrashIcon } from "lucide-react";

export const RightActions = ({
  listId,
  itemId,
}: {
  listId: string;
  itemId: string;
}) => {
  const utils = api.useUtils();
  const { mutate: deleteItem } = api.item.deleteItem.useMutation({
    onSuccess: () => {
      utils.list.getList.setData({ listId }, (data) => {
        if (!data) return data;

        const updatedItems = data.items.filter((i) => i.id !== itemId);

        return { ...data, items: updatedItems };
      });
    },
  });

  return (
    <TrailingActions>
      <SwipeAction
        destructive
        onClick={() => {
          deleteItem({ itemId, listId });
        }}
      >
        <div
          className={
            "flex h-full flex-col items-end !justify-center bg-red-700 pr-5"
          }
        >
          <div className={"flex w-fit flex-col items-center"}>
            <TrashIcon />
            Delete
          </div>
        </div>
      </SwipeAction>
    </TrailingActions>
  );
};
