import type { NextApiRequest, NextApiResponse } from "next";
import { lucia } from "~/auth";
import { validateRequest } from "~/server/api/trpc";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(404).end();
    return;
  }
  const { session } = await validateRequest({ req, res });
  if (!session) {
    res.status(401).end();
    return;
  }
  await lucia.invalidateSession(session.id);
  res
    .setHeader("Set-Cookie", lucia.createBlankSessionCookie().serialize())
    .status(200)
    .end();
}
