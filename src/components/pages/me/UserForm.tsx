import { Button, Image, Loader, TextInput } from "@mantine/core";
import { AtSignIcon, CheckIcon, UserIcon } from "lucide-react";
import { useUserFormContext } from "./updateUserFormContext";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

export const UserForm = ({ image }: { image: string | null | undefined }) => {
  const form = useUserFormContext();
  const { reload } = useRouter();
  const { mutate, isLoading } = api.user.updateUser.useMutation({
    onSuccess: () => {
      reload();
    },
  });

  return (
    <form
      onSubmit={form.onSubmit(({ name, email }) => mutate({ name, email }))}
      className={"flex flex-col"}
    >
      <Image
        src={image ?? ""}
        alt={"profile picture"}
        className={"h-32 w-32 self-center"}
        radius={"md"}
      />
      <TextInput
        label="Username"
        placeholder={"DrFractum"}
        leftSectionPointerEvents={"none"}
        leftSection={<UserIcon className={"h-4 w-4"} />}
        className={"mt-2"}
        {...form.getInputProps("name")}
      />
      <TextInput
        label={"Email"}
        leftSectionPointerEvents={"none"}
        leftSection={<AtSignIcon className={"h-4 w-4"} />}
        className={"mt-2"}
        {...form.getInputProps("email")}
      />
      <Button
        className={"mt-5 w-32 self-end"}
        leftSection={
          isLoading ? <Loader color={"white"} size={"xs"} /> : <CheckIcon />
        }
        type={"submit"}
        disabled={!form.isDirty() || !form.isValid()}
      >
        Save
      </Button>
    </form>
  );
};
