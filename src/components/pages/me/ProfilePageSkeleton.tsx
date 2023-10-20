import {
  Avatar,
  AvatarGroup,
  Button,
  Card,
  Grid,
  Loader,
  Popover,
  Select,
  Skeleton,
  Text,
  Title,
} from "@mantine/core";
import { CheckIcon } from "lucide-react";

export const ProfilePageSkeleton = () => (
  <>
    <Grid.Col
      span={{ base: 12, sm: 6 }}
      order={{ base: 2, sm: 1 }}
      className={"mt-20 sm:mt-0"}
    >
      <Card className={"xs:w-72 mt-3"}>
        <Skeleton className={"h-32 w-32 self-center"} />
        <Text className={"mt-3"} fw={500} size={"sm"}>
          Username
        </Text>
        <Skeleton className={"h-8 w-full"} />
        <Text className={"mt-4"} fw={500} size={"sm"}>
          Email
        </Text>
        <Skeleton className={"h-8 w-full"} />
        <Button
          className={"ml-1 mt-6 w-24 self-end"}
          leftSection={<CheckIcon />}
          disabled
        >
          Save
        </Button>
      </Card>
    </Grid.Col>
    <Grid.Col span={{ base: 12, sm: 6 }} order={{ base: 1, sm: 2 }}>
      <div className={"xs:w-72"}>
        <Title order={4}>Your user card</Title>
        <Text>This is how you appear to other users</Text>
        <Card className={"mt-2"}>
          <Title order={5}>Collaborators in this list</Title>
          <AvatarGroup className={"mt-1"}>
            <Popover opened withArrow position={"bottom-start"}>
              <Popover.Target>
                <Avatar>
                  <Skeleton className={"h-8 w-8"} />
                </Avatar>
              </Popover.Target>

              <Popover.Dropdown>
                <Card>
                  <div className={"flex flex-row items-center"}>
                    <Avatar className={"mr-3"}>
                      <Skeleton className={"h-8 w-8"} />
                    </Avatar>
                    <div>
                      <Skeleton className={"h-4 w-24"} />
                      <Skeleton className={"mt-2 h-4 w-40"} />
                    </div>
                  </div>
                </Card>
              </Popover.Dropdown>
            </Popover>
            <Avatar>RH</Avatar>
            <Avatar>CV</Avatar>
            <Avatar>SH</Avatar>
            <Avatar>+5</Avatar>
          </AvatarGroup>
        </Card>
      </div>
    </Grid.Col>
    <Grid.Col span={{ base: 12, sm: 6 }} order={3}>
      <div className={"xs:w-72"}>
        <Card className={"mt-5"}>
          <div className={"flex items-center"}>
            <Title order={5}>Default workspace</Title>
          </div>
          <div className={"mt-3 flex flex-col"}>
            <Select
              leftSection={<Loader color={"dark"} size={"xs"} />}
              placeholder={"None"}
              disabled
            />
            <Button
              className={"mt-5 w-24 self-end"}
              leftSection={<CheckIcon />}
              disabled
            >
              Save
            </Button>
          </div>
        </Card>
      </div>
    </Grid.Col>
  </>
);
