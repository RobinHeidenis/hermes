import { useRouter } from "next/router";
import { useForm, zodResolver } from "@mantine/form";
import { signupSchema } from "~/schemas/signup";
import { api } from "~/utils/api";

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
  const { mutate } = api.auth.signup.useMutation({
    onSuccess: () => {
      void router.push("/workspace");
    },
  });

  return (
    <>
      <h1>Create an account</h1>
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
        <label htmlFor="email">Email</label>
        <input name="email" id="email" {...form.getInputProps("email")} />
        <br />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          {...form.getInputProps("password")}
        />
        <br />
        <button>Continue</button>
      </form>
    </>
  );
}
