import Head from "next/head";

import { Button, Title } from "@mantine/core";
import type { PublicProps } from "~/auth";
import { allowPublicSSP as getServerSideProps } from "~/auth";
import { SignOutForm } from "~/components/navigation/SignOutForm";
import Link from "next/link";
import { useSetUser } from "~/hooks/useSetUser";

export { getServerSideProps };

export default function Home({ user }: PublicProps) {
  useSetUser(user);

  return (
    <>
      <Head>
        <title>Hermes</title>
        <meta
          name="description"
          content="Shopping list and expenses tracker app"
        />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        {user ? (
          <>
            <Title>Welcome {user.name}</Title>
            <Button component={Link} href={"/workspace"} className={"mb-3"}>
              Workspaces
            </Button>
            <SignOutForm>
              <Button type={"submit"} bg={"red"}>
                Logout
              </Button>
            </SignOutForm>
          </>
        ) : (
          <Button component={"a"} href={"/auth/login"}>
            Login
          </Button>
        )}
      </main>
    </>
  );
}
