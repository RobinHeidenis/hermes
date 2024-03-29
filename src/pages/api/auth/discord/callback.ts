import type { NextApiRequest, NextApiResponse } from "next";
import { discord, lucia } from "~/auth";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { OAuth2RequestError } from "arctic";
import { users } from "~/server/db/schema";
import { generateId } from "lucia";
import dayjs from "dayjs";

interface DiscordUser {
  id: number;
  username: string;
  avatar?: string | null;
  email?: string | null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.status(404).end();
    return;
  }
  const code = req.query.code?.toString() ?? null;
  const state = req.query.state?.toString() ?? null;
  const storedState = req.cookies.discord_oauth_state ?? null;
  const returnTo = req.cookies.return_to ?? null;
  if (!code || !state || !storedState || state !== storedState) {
    console.log(code, state, storedState);
    const error = req.query.error as string | undefined;
    if (error) {
      console.error(error, req.query.error_description);
      res
        .redirect(
          `/auth/login?error=${error === "access_denied" ? encodeURIComponent("User cancelled the login attempt") : encodeURIComponent("Something went wrong logging you in with Discord")}${returnTo ? `&returnTo=${returnTo}` : ""}`,
        )
        .end();
      return;
    }
    res.status(400).end();
    return;
  }
  try {
    const tokens = await discord.validateAuthorizationCode(code);
    const discordResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const user = (await discordResponse.json()) as DiscordUser;
    const existingUser = await db.query.users.findFirst({
      where: eq(users.discord_id, user.id),
    });

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      res.appendHeader(
        "Set-Cookie",
        lucia.createSessionCookie(session.id).serialize(),
      );

      if (returnTo) {
        res
          .appendHeader(
            "Set-Cookie",
            `return_to=; Expires=${dayjs().subtract(1, "day").toString()}; Path=/; SameSite=Lax; HttpOnly`,
          )
          .redirect(returnTo)
          .end();
        return;
      }
      res.redirect("/workspace").end();
      return;
    }

    const userId = generateId(15);
    await db.insert(users).values({
      id: userId,
      discord_id: user.id,
      name: user.username ?? null,
      email: user.email ?? "",
      image: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`,
    });
    const session = await lucia.createSession(userId, {});
    res.appendHeader(
      "Set-Cookie",
      lucia.createSessionCookie(session.id).serialize(),
    );

    if (returnTo) {
      res
        .appendHeader(
          "Set-Cookie",
          `return_to=; Expires=${dayjs().subtract(1, "day").toString()}; Path=/; SameSite=Lax; HttpOnly`,
        )
        .redirect(returnTo)
        .end();
      return;
    }
    res.redirect("/workspace").end();
    return;
  } catch (e) {
    if (e instanceof OAuth2RequestError) {
      const { message, description, request } = e;
      console.error(message, description);
      console.dir(request, { depth: 10 });
      res.status(400).end();
      return;
    }
    console.error(e);
    res.status(500).end();
    return;
  }
}
