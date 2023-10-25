import { ListItem } from "~/components/pages/list/ListItem";
import { CheckIcon } from "lucide-react";
import { Title } from "@mantine/core";
import { SwipeableList } from "react-swipeable-list";
import type { RouterOutputs } from "~/utils/api";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export const List = ({
  items,
  listId,
  forceUpdate,
}: {
  items: RouterOutputs["list"]["getList"]["items"];
  listId: string;
  forceUpdate: () => void;
}) => {
  const [ref] = useAutoAnimate();
  const showLinkSpace = items.some((i) => i.externalUrl) ?? false;
  const checkedItems = items.filter((i) => i.checked);
  const uncheckedItems = items.filter((i) => !i.checked);

  return (
    <SwipeableList threshold={0.2}>
      <div ref={ref}>
        {uncheckedItems.map((item) => (
          <ListItem
            key={item.id}
            item={item}
            showLinkSpace={showLinkSpace}
            listId={listId}
            forceUpdate={forceUpdate}
          />
        ))}
        {checkedItems.length > 0 && (
          <div className={"flex items-center py-2"}>
            <CheckIcon className={"mr-1"} />
            <Title order={4}>Checked items</Title>
          </div>
        )}
        {checkedItems.map((item) => (
          <ListItem
            key={item.id}
            item={item}
            showLinkSpace={showLinkSpace}
            listId={listId}
            forceUpdate={forceUpdate}
          />
        ))}
      </div>
    </SwipeableList>
  );
};
