import { useRouter } from "next/router";
import type { FormEvent } from "react";

export default function Page() {
  const router = useRouter();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
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
  }

  return (
    <>
      <h1>Create an account</h1>
      <form method="post" action="/api/auth/signup" onSubmit={onSubmit}>
        <label htmlFor="username">Username</label>
        <input name="username" id="username" />
        <br />
        <label htmlFor="email">Email</label>
        <input name="email" id="email" />
        <br />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
        <br />
        <button>Continue</button>
      </form>
    </>
  );
}
