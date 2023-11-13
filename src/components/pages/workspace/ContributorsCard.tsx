import { Avatar, AvatarGroup, Card, Popover, Text } from "@mantine/core";
import { UserAvatar } from "~/components/pages/workspace/UserAvatar";
import type { RouterOutputs } from "~/utils/api";
import { useHover } from "@mantine/hooks";

export const ContributorsCard = ({
  contributors,
}: {
  contributors: RouterOutputs["workspace"]["getWorkspace"]["users"]["contributors"];
}) => {
  const { hovered, ref } = useHover();
  return (
    <Card className={"ml-3 flex flex-row justify-center"}>
      <Text className={"mr-2"}>Contributors:</Text>
      <AvatarGroup>
        {contributors.length > 3 ? (
          <>
            {contributors
              .slice(0, 3)
              .map(
                (user) =>
                  user.name &&
                  user.image && (
                    <UserAvatar
                      name={user.name}
                      image={user.image}
                      key={user.id}
                    />
                  ),
              )}
            <Popover opened={hovered} withArrow position={"bottom-start"}>
              <Popover.Target ref={ref}>
                <Avatar size={"sm"}>+{contributors.length - 3}</Avatar>
              </Popover.Target>

              <Popover.Dropdown>
                {contributors.slice(3).map((user) => (
                  <div className={"flex pl-2"} key={user.id}>
                    <Avatar src={user.image} size={"sm"} />
                    <Text className={"ml-2"}>{user.name}</Text>
                  </div>
                ))}
              </Popover.Dropdown>
            </Popover>
          </>
        ) : (
          contributors.map(
            (user) =>
              user.name &&
              user.image && (
                <UserAvatar name={user.name} image={user.image} key={user.id} />
              ),
          )
        )}
      </AvatarGroup>
    </Card>
  );
};
