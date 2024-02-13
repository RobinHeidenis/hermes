import type { NextApiRequest, NextApiResponse } from "next";
import { generateState } from "arctic";
import { discord } from "~/auth";
import { serializeCookie } from "oslo/cookie";
import { env } from "~/env.mjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.status(404).end();
    return;
  }
  const state = generateState();
  const url = await discord.createAuthorizationURL(state, {
    scopes: ["identify"],
  });
  res
    .appendHeader(
      "Set-Cookie",
      serializeCookie("discord_oauth_state", state, {
        path: "/",
        secure: env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: "lax",
      }),
    )
    .redirect(url.toString());
}
