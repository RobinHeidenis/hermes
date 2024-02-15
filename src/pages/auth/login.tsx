import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();

  return (
    <>
      <h1>Sign in</h1>
      <a href={"/api/auth/discord"}>Sign in with Discord</a>
      <form
        method={"POST"}
        action={"/api/auth/login"}
        onSubmit={async (e) => {
          e.preventDefault();
          const formElement = e.target as HTMLFormElement;
          const response = await fetch(formElement.action, {
            method: formElement.method,
            body: JSON.stringify(
              Object.fromEntries(new FormData(formElement).entries()),
            ),
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (response.ok) {
            void router.push("/workspace");
          }
        }}
      >
        <label htmlFor="username">Username</label>
        <input name="username" id="username" />
        <br />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
        <br />
        <button type={"submit"}>Continue</button>
      </form>
    </>
  );
}
