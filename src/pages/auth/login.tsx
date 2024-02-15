import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useForm, zodResolver } from "@mantine/form";
import { loginSchema } from "~/schemas/login";

export default function Page() {
  const router = useRouter();
  const { mutate } = api.auth.login.useMutation({
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
    <>
      <h1>Sign in</h1>
      <a href={"/api/auth/discord"}>Sign in with Discord</a>
      <form
        onSubmit={form.onSubmit((values) => {
          mutate(values);
        })}
      >
        <label htmlFor="username">Username</label>
        <input
          name="username"
          id="username"
          {...form.getInputProps("username")}
        />
        <br />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          {...form.getInputProps("password")}
        />
        <br />
        <button type={"submit"}>Continue</button>
      </form>
    </>
  );
}
