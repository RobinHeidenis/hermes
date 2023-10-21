import type { NullableString } from "~/utils/NullableType";
import { Avatar, Card, Text } from "@mantine/core";

export const UserCard = ({
  name,
  image,
}: {
  name: NullableString;
  image: NullableString;
}) => (
  <Card p={"xs"} className={"flex flex-row items-center"}>
    <Avatar src={image} className={"mr-3"} />
    <Text>{name}</Text>
  </Card>
);
