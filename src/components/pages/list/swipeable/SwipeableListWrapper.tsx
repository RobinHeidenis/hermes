import type { PropsWithChildren } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { SwipeableList } from "react-swipeable-list";

export const SwipeableListWrapper = ({ children }: PropsWithChildren) => {
  const [ref] = useAutoAnimate();

  return (
    <SwipeableList threshold={0.2}>
      <div ref={ref}>{children}</div>
    </SwipeableList>
  );
};
