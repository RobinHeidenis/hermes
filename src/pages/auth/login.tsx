import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useForm, zodResolver } from "@mantine/form";
import { loginSchema } from "~/schemas/login";
import {
  Button,
  Card,
  Divider,
  Image,
  Loader,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { LockIcon, LogInIcon, UserIcon } from "lucide-react";
import Link from "next/link";

export default function Page() {
  const router = useRouter();
  const { mutate, isLoading } = api.auth.login.useMutation({
    onSuccess: () => {
      void router.push("/workspace");
    },
  });
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
    validate: zodResolver(loginSchema),
  });

  return (
    <div className={"flex h-dvh items-center justify-center"}>
      <Card className={"flex w-96 flex-col items-center pb-12"} withBorder>
        <Image
          src={"/logo.png"}
          alt={"hermes logo"}
          className={"w-32"}
          width={30}
          height={30}
        />
        <Title order={2}>Welcome</Title>
        <Text>Sign in to Hermes to continue</Text>

        <Button
          component={"a"}
          className={"mt-5 flex justify-center"}
          color={"#5865F2"}
          leftSection={
            <div className={"mt-0.5 h-4 w-4"}>
              <DiscordIcon />
            </div>
          }
          href={"/api/auth/discord"}
        >
          Sign in with Discord
        </Button>
        <Text c={"red"} className={"mt-2"}>
          {router.query.error ?? ""}
        </Text>
        <Divider className={"mb-3 mt-5 w-full"} label={"OR"} color={"gray.6"} />
        <form
          onSubmit={form.onSubmit((values) => {
            mutate(values);
          })}
          className={"flex flex-col gap-y-3"}
        >
          <TextInput
            label={"Username"}
            leftSection={<UserIcon className={"h-4 w-4"} />}
            placeholder={"DrFractum"}
            {...form.getInputProps("username")}
          />
          <PasswordInput
            label={"Password"}
            leftSection={<LockIcon className={"h-4 w-4"} />}
            {...form.getInputProps("password")}
          />
          <Button
            className={"mt-2 flex w-full flex-row justify-center"}
            leftSection={
              isLoading ? (
                <Loader color={"white"} size={"xs"} />
              ) : (
                <LogInIcon className={"h-4 w-4"} />
              )
            }
            type={"submit"}
          >
            Sign in
          </Button>
        </form>
        <Link href={"/auth/signup"} className={"ml-14 mt-3 self-start"}>
          <Text size={"xs"}>Don&apos;t have an account yet? </Text>
          <Text size={"xs"} c={"blue"}>
            Create an account
          </Text>
        </Link>
      </Card>
    </div>
  );
}

export const DiscordIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36">
    <path
      fill="#fff"
      d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"
    />
  </svg>
);
