import { ListItem } from "~/components/pages/list/ListItem";
import { CheckIcon } from "lucide-react";
import { Title } from "@mantine/core";
import { SwipeableList } from "react-swipeable-list";
import type { RouterOutputs } from "~/utils/api";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export const List = ({
  items,
  listId,
}: {
  items: RouterOutputs["list"]["getList"]["items"];
  listId: string;
}) => {
  const [ref] = useAutoAnimate();
  const showLinkSpace = items.some((i) => i.externalUrl) ?? false;
  const checkedItems = items.filter((i) => i.checked);
  const uncheckedItems = items.filter((i) => !i.checked);

  return (
    <SwipeableList threshold={0.2} className={"mt-4"}>
      <div ref={ref}>
        {uncheckedItems.map(
          ({ id, name, price, quantity, checked, externalUrl }) => (
            <ListItem
              itemId={id}
              key={id}
              name={name}
              price={price}
              quantity={quantity}
              checked={checked ?? false}
              externalUrl={externalUrl}
              showLinkSpace={showLinkSpace}
              listId={listId}
            />
          ),
        )}
        {checkedItems.length > 0 && (
          <div className={"flex items-center py-2"}>
            <CheckIcon className={"mr-1"} />
            <Title order={4}>Checked items</Title>
          </div>
        )}
        {checkedItems.map(
          ({ id, name, price, quantity, checked, externalUrl }) => (
            <ListItem
              itemId={id}
              key={id}
              name={name}
              price={price}
              quantity={quantity}
              checked={checked ?? false}
              externalUrl={externalUrl}
              showLinkSpace={showLinkSpace}
              listId={listId}
            />
          ),
        )}
      </div>
    </SwipeableList>
  );
};
