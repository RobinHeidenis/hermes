import {
  Card,
  Skeleton,
  Text,
  ThemeIcon,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { ListIcon, UserIcon } from "lucide-react";

export const SkeletonWorkspaceCard = () => {
  const { colors } = useMantineTheme();
  const { hovered, ref } = useHover();

  return (
    <Card
      ref={ref}
      maw={"20rem"}
      miw={"20rem"}
      mah={"10rem"}
      mih={"10rem"}
      className={`flex flex-col justify-between transition ${
        hovered ? `scale-105 transform` : ""
      }`}
      withBorder
      shadow={hovered ? "md" : "sm"}
      radius="md"
      bg={hovered ? "dark.5" : ""}
    >
      <div className={"flex h-auto items-start justify-start"}>
        <ThemeIcon className={`mr-4 p-3`} size={"xl"} color={colors.dark[7]}>
          <Skeleton className={"h-6 w-6"} />
        </ThemeIcon>
        <div>
          <Skeleton>
            <Title order={4}>Loading your super cool</Title>
          </Skeleton>
          <Skeleton className={"mt-2"}>
            <Title order={4}>list right now...</Title>
          </Skeleton>
        </div>
      </div>
      <div className={"flex"}>
        <div className={"flex items-center"}>
          <UserIcon className={"mr-1 h-5 w-5"} />
          <Skeleton className={"mr-1 h-4 w-5"} />
          <Text>users</Text>
        </div>
        <Text className={"ml-2 mr-2"} span>
          •
        </Text>
        <div className={"flex items-center"}>
          <ListIcon className={"mr-1 h-5 w-5"} />
          <Skeleton className={"mr-1 h-4 w-5"} />
          <Text>lists</Text>
        </div>
      </div>
    </Card>
  );
};
