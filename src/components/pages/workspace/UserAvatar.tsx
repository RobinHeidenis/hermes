import { useDisclosure } from "@mantine/hooks";
import { Avatar, Popover } from "@mantine/core";
import { UserCard } from "~/components/user/UserCard";

export const UserAvatar = ({
  name,
  image,
}: {
  name: string;
  image: string;
}) => {
  const [opened, { close, open }] = useDisclosure(false);

  return (
    <Popover withArrow position={"bottom-start"} opened={opened}>
      <Popover.Target>
        <Avatar
          src={image}
          size={"sm"}
          className={"mr-2"}
          onMouseEnter={open}
          onMouseLeave={close}
        />
      </Popover.Target>
      <Popover.Dropdown style={{ pointerEvents: "none" }}>
        <UserCard name={name} image={image} />
      </Popover.Dropdown>
    </Popover>
  );
};
