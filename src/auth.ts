import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "~/server/db";
import { sessions } from "~/server/db/schema/sessions";
import { Lucia, type Session, type User } from "lucia";
import { env } from "~/env.mjs";
import { Discord } from "arctic";
import { users } from "~/server/db/schema";
import type { IncomingMessage, ServerResponse } from "http";
import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
} from "next";

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const discord = new Discord(
  env.DISCORD_CLIENT_ID,
  env.DISCORD_CLIENT_SECRET,
  `${env.NODE_ENV === "production" ? "https://hermes.fractum.nl" : `http://${env.VERCEL_URL}`}/api/auth/discord/callback`,
);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      discordId: attributes.discord_id,
      username: attributes.username,
      name: attributes.name,
      email: attributes.email,
      image: attributes.image,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  discord_id: number;
  username: string | null;
  name: string;
  email: string;
  image: string;
}

export const validateRequest = async ({
  req,
  res,
}: {
  req: IncomingMessage;
  res: ServerResponse;
}): Promise<
  { user: User; session: Session } | { user: null; session: null }
> => {
  const sessionId = lucia.readSessionCookie(req.headers.cookie ?? "");
  if (!sessionId) {
    return { user: null, session: null };
  }
  const result = await lucia.validateSession(sessionId);
  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      res.appendHeader("Set-Cookie", sessionCookie.serialize());
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      res.appendHeader("Set-Cookie", sessionCookie.serialize());
    }
  } catch (e) {
    console.error("Failed to set session cookie");
  }
  return result;
};

export function createAuthSSP(
  requireAuth: true,
): (
  context: GetServerSidePropsContext,
) => Promise<GetServerSidePropsResult<{ user: User }>>;
export function createAuthSSP(
  requireAuth: false,
): (
  context: GetServerSidePropsContext,
) => Promise<GetServerSidePropsResult<{ user: User | null }>>;
export function createAuthSSP(
  requireAuth: boolean,
): (
  context: GetServerSidePropsContext,
) => Promise<GetServerSidePropsResult<{ user: (User | null) | User }>>;
export function createAuthSSP(requireAuth = true) {
  return async (
    context: GetServerSidePropsContext,
  ): Promise<
    GetServerSidePropsResult<{
      user: typeof requireAuth extends true ? User : User | null;
    }>
  > => {
    const { user } = await validateRequest({
      req: context.req,
      res: context.res,
    });
    if (requireAuth) {
      if (!user) {
        return {
          redirect: {
            permanent: false,
            destination: `/auth/login?returnTo=${context.req.url}`,
          },
        };
      }
      return { props: { user: user } };
    }
    return { props: { user } };
  };
}

export const requireAuthSSP = createAuthSSP(true);
export const allowPublicSSP = createAuthSSP(false);

export type AuthedProps = InferGetServerSidePropsType<typeof requireAuthSSP>;
export type PublicProps = InferGetServerSidePropsType<typeof allowPublicSSP>;
