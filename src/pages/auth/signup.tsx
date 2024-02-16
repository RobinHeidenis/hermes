import { useRouter } from "next/router";
import { useForm, zodResolver } from "@mantine/form";
import { signupSchema } from "~/schemas/signup";
import { api } from "~/utils/api";
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
  Tooltip,
} from "@mantine/core";
import { DiscordIcon } from "~/pages/auth/login";
import {
  AtSignIcon,
  HelpCircleIcon,
  LockIcon,
  LogInIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";

export default function Page() {
  const router = useRouter();
  const form = useForm({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validate: zodResolver(signupSchema),
  });
  const { mutate, isLoading, error } = api.auth.signup.useMutation({
    onSuccess: () => {
      void router.push("/workspace");
    },
  });

  return (
    <div className={"flex h-dvh items-center justify-center"}>
      <Card className={"flex w-96 flex-col items-center pb-10"} withBorder>
        <Image
          src={"/logo.png"}
          alt={"hermes logo"}
          className={"w-32"}
          width={30}
          height={30}
        />
        <Title order={2}>Welcome</Title>
        <Text>Create an account to continue</Text>
        {error !== null && (
          <Text c={"red"} className={"mb-5 mt-5"}>
            {error?.message ?? ""}
          </Text>
        )}
        <form
          onSubmit={form.onSubmit((values) => {
            mutate(values);
          })}
          className={`${error === null && "mt-5"} flex flex-col gap-y-3`}
        >
          <TextInput
            label={"Email"}
            leftSection={<AtSignIcon className={"h-4 w-4"} />}
            placeholder={"info@fractum.nl"}
            description={
              <Tooltip
                color={"gray"}
                label={
                  "Just fill in info@example.com if you don't want to use your real email, it's okay with me"
                }
              >
                <div className={"flex items-center gap-x-1"}>
                  <Text size={"xs"}>
                    We don&apos;t use your email for anything
                  </Text>
                  <HelpCircleIcon className={"h-3 w-3"} />
                </div>
              </Tooltip>
            }
            required
            {...form.getInputProps("email")}
          />
          <TextInput
            label={"Username"}
            description={"This is what you'll be logging in with"}
            leftSection={<UserIcon className={"h-4 w-4"} />}
            placeholder={"DrFractum"}
            required
            {...form.getInputProps("username")}
          />
          <PasswordInput
            label={"Password"}
            description={"Must be at least 10 characters long"}
            leftSection={<LockIcon className={"h-4 w-4"} />}
            required
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
            Create account
          </Button>
        </form>
        <Link href={"/auth/login"} className={"ml-14 mt-3 self-start"}>
          <Text size={"xs"}>Already have an account?</Text>
          <Text size={"xs"} c={"blue"}>
            Sign in to Hermes
          </Text>
        </Link>
        <Divider className={"mb-3 mt-5 w-full"} label={"OR"} color={"gray.6"} />
        <Button
          component={"a"}
          className={"mt-3 flex justify-center"}
          color={"#5865F2"}
          leftSection={
            <div className={"mt-0.5 h-4 w-4"}>
              <DiscordIcon />
            </div>
          }
          href={"/api/auth/discord"}
        >
          Continue with Discord
        </Button>
      </Card>
    </div>
  );
}
