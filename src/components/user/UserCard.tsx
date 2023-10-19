import type { NullableString } from "~/utils/NullableType";
import { Avatar, Card, Text } from "@mantine/core";

export const UserCard = ({
  name,
  email,
  image,
}: {
  name: NullableString;
  email: NullableString;
  image: NullableString;
}) => (
  <Card>
    <div className={"flex flex-row items-center"}>
      <Avatar src={image} className={"mr-3"} />
      <div>
        <Text>{name}</Text>
        <Text c={"dimmed"} size={"sm"}>
          {email}
        </Text>
      </div>
    </div>
  </Card>
);
