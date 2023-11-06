import { api } from "~/utils/api";
import { LeadingActions, SwipeAction } from "react-swipeable-list";
import { CheckIcon, UndoIcon } from "lucide-react";
import { useLocalStorage } from "@mantine/hooks";

export const LeftActions = ({
  itemChecked,
  itemId,
  listId,
}: {
  itemChecked: boolean;
  itemId: string;
  listId: string;
}) => {
  const utils = api.useUtils();
  const [, setHasCheckedItems] = useLocalStorage({
    key: "hasCheckedItems",
    defaultValue: false,
  });

  const { mutate: setItemChecked } = api.item.setItemChecked.useMutation({
    onMutate: async (checkedItem) => {
      setHasCheckedItems(true);
      await utils.list.getList.cancel({ listId });
      const previousList = utils.list.getList.getData({ listId });
      utils.list.getList.setData({ listId }, (data) => {
        if (!data) return data;
        const updatedItems = data.items.map((i) =>
          i.id === checkedItem.itemId
            ? { ...i, checked: checkedItem.checked }
            : i,
        );
        return { ...data, items: updatedItems };
      });

      return { previousList, checkedItem };
    },
    onError: (_error, _list, context) => {
      utils.list.getList.setData({ listId }, context?.previousList);
    },
    onSettled: () => utils.list.getList.invalidate({ listId }),
  });
  return (
    <LeadingActions>
      <SwipeAction
        onClick={() => {
          setItemChecked({ itemId, listId, checked: !itemChecked });
        }}
      >
        <div
          className={`flex h-full flex-col !justify-center ${
            itemChecked ? "bg-yellow-700" : "bg-green-800"
          } pl-5`}
        >
          <div className={"flex w-fit flex-col items-center"}>
            {itemChecked ? <UndoIcon /> : <CheckIcon className={"h-7 w-7"} />}
            {itemChecked ? "Undo" : "Check"}
          </div>
        </div>
      </SwipeAction>
    </LeadingActions>
  );
};
