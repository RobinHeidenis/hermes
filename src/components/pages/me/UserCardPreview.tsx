import { Avatar, AvatarGroup, Card, Popover, Title } from "@mantine/core";
import { UserCard } from "~/components/user/UserCard";
import { useUserFormContext } from "./updateUserFormContext";
import type { Session } from "next-auth";

export const UserCardPreview = ({ user }: { user: Session["user"] }) => {
  const {
    values: { name, email },
  } = useUserFormContext();

  return (
    <Card className={"mt-2"}>
      <Title order={5}>Collaborators in this list</Title>
      <AvatarGroup className={"mt-1"}>
        <Popover opened withArrow position={"bottom-start"}>
          <Popover.Target>
            <Avatar src={user.image} />
          </Popover.Target>

          <Popover.Dropdown>
            <UserCard
              name={name.length > 0 ? name : user.name}
              email={email.length > 0 ? email : user.email}
              image={user.image}
            />
          </Popover.Dropdown>
        </Popover>
        <Avatar>RH</Avatar>
        <Avatar>CV</Avatar>
        <Avatar>SH</Avatar>
        <Avatar>+5</Avatar>
      </AvatarGroup>
    </Card>
  );
};
