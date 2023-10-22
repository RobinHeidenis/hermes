import Link from "next/link";
import { Card, Text, ThemeIcon, Title, useMantineTheme } from "@mantine/core";
import { ListTodoIcon, StretchHorizontalIcon } from "lucide-react";
import { useHover } from "@mantine/hooks";
import { getPluralOrSingular } from "./WorkspaceCard";
import type { FC } from "react";
import { useRouter } from "next/router";

interface ListCardProps {
  id: string;
  name: string | null;
  items: { id: string }[];
}

export const ListCard: FC<ListCardProps> = ({ id, name, items }) => {
  const { colors } = useMantineTheme();
  const { hovered, ref } = useHover<HTMLAnchorElement>();
  const { asPath } = useRouter();

  return (
    <Card
      maw={"20rem"}
      miw={"20rem"}
      mah={"10rem"}
      mih={"10rem"}
      ref={ref}
      className={`flex flex-col justify-between shadow-sm transition hover:scale-105 hover:transform hover:shadow-md`}
      withBorder
      radius="md"
      bg={hovered ? "dark.5" : ""}
      component={Link}
      href={`${asPath}/list/${id}`}
    >
      <div className={"flex h-auto items-start justify-start"}>
        <ThemeIcon className={`mr-4 p-3`} size={"xl"} color={colors.dark[7]}>
          <ListTodoIcon size={30} />
        </ThemeIcon>
        <div>
          <Title
            order={4}
            className={"line-clamp-3 text-ellipsis [overflow-wrap:anywhere]"}
          >
            {name}
          </Title>
        </div>
      </div>
      <div className={"flex"}>
        <div className={"flex items-center"}>
          <StretchHorizontalIcon className={"mr-1 h-5 w-5"} />
          <Text>
            {items.length} {getPluralOrSingular(items.length, "item")}
          </Text>
        </div>
      </div>
    </Card>
  );
};
