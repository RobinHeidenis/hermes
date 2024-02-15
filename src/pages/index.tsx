import Head from "next/head";

import { Button, Title } from "@mantine/core";
import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
} from "next";
import type { User } from "lucia";
import { validateRequest } from "~/auth";
import { SignOutForm } from "~/components/navigation/SignOutForm";

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<{ user: User | null }>> => {
  const { user } = await validateRequest({
    req: context.req,
    res: context.res,
  });
  return { props: { user } };
};

export default function Home({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
            <SignOutForm>
              <Button type={"submit"}>Logout</Button>
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
