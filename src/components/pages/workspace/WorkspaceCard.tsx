import { Card, Text, ThemeIcon, Title, useMantineTheme } from "@mantine/core";
import { ListIcon, StoreIcon, UserIcon } from "lucide-react";
import { useHover } from "@mantine/hooks";
import Link from "next/link";
import type { FC } from "react";

interface WorkspaceCardProps {
  id: string;
  name: string;
  users: number;
  lists: number;
}

export const WorkspaceCard: FC<WorkspaceCardProps> = ({
  id,
  name,
  users,
  lists,
}) => {
  const { colors } = useMantineTheme();
  const { hovered, ref } = useHover<HTMLAnchorElement>();

  return (
    <Card
      ref={ref}
      maw={"20rem"}
      miw={"20rem"}
      mah={"10rem"}
      mih={"10rem"}
      className={`mantine-focus-auto flex transform flex-col justify-between shadow-sm transition hover:scale-105 hover:shadow-md focus:scale-105`}
      withBorder
      radius="md"
      bg={hovered ? "dark.5" : ""}
      component={Link}
      href={`/workspace/${id}`}
    >
      <div className={"flex h-auto items-start justify-start"}>
        <ThemeIcon className={`mr-4 p-3`} size={"xl"} color={colors.dark[7]}>
          <StoreIcon size={30} />
        </ThemeIcon>
        <div>
          <Title
            order={4}
            style={{ viewTransitionName: `workspace-title-${id}` }}
            className={`line-clamp-3 text-ellipsis [overflow-wrap:anywhere]`}
          >
            {name}
          </Title>
        </div>
      </div>
      <div className={"flex"}>
        <div className={"flex items-center"}>
          <UserIcon className={"mr-1 h-5 w-5"} />
          <Text>
            {users + 1} {getPluralOrSingular(users + 1, "user")}
          </Text>
        </div>
        <Text className={"ml-2 mr-2"} span>
          •
        </Text>
        <div className={"flex items-center"}>
          <ListIcon className={"mr-1 h-5 w-5"} />
          <Text>
            {lists} {getPluralOrSingular(lists, "list")}
          </Text>
        </div>
      </div>
    </Card>
  );
};

export const getPluralOrSingular = (amount: number, singular: string) => {
  return amount > 1 || amount === 0 ? singular + "s" : singular;
};
