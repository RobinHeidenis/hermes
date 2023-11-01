import Head from "next/head";

import { Button, Title } from "@mantine/core";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Home() {
  const { user } = useUser();

  return (
    <>
      <Head>
        <title>Hermes</title>
        <meta
          name="description"
          content="Shopping list and expenses tracker app"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        {user ? (
          <>
            <Title>Welcome {user.name}</Title>
            {user.sub}
            <Button component={"a"} href={"api/auth/logout"}>
              Logout
            </Button>
          </>
        ) : (
          <Button component={"a"} href={"api/auth/login?returnTo=/workspace"}>
            Login
          </Button>
        )}
      </main>
    </>
  );
}
