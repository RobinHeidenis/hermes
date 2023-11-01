process.env.AUTH0_BASE_URL =
  env.AUTH0_BASE_URL || "https://" + process.env.VERCEL_URL;

import { env } from "~/env.mjs";
import { handleAuth, handleCallback, handleLogin } from "@auth0/nextjs-auth0";
import { eq } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";

declare module "@auth0/nextjs-auth0" {
  interface Claims {
    name?: string;
    email?: string;
    picture?: string;
    sub?: string;
  }
}

export default handleAuth({
  login: handleLogin({
    authorizationParams: {
      upstreamParams: {
        prompt: "none",
      },
    },
  }),
  async callback(req: NextApiRequest, res: NextApiResponse) {
    await handleCallback(req, res, {
      afterCallback: async (_req, _res, session, _state) => {
        if (
          !session?.user?.sub ||
          !session.user.name ||
          !session.user.email ||
          !session.user.picture
        )
          throw new Error("Invalid user data");

        const user = await db.query.users.findFirst({
          where: eq(users.id, session.user.sub),
        });

        if (user) return session;

        await db.insert(users).values({
          id: session.user.sub,
          name: session.user.name,
          email: session.user.email,
          image: session.user.picture,
        });

        return session;
      },
    });
  },
});
