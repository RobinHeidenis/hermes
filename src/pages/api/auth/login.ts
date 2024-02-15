import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { users } from "~/server/db/schema";
import { Argon2id } from "oslo/password";
import { lucia } from "~/auth";

const loginSchema = z.object({
  username: z.string().min(1).max(30),
  password: z.string().min(10).max(64),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(404).end();
    return;
  }

  const parsedBody = loginSchema.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(400).json({
      error: "Validation failed for username or password",
      zodErrors: parsedBody.error.errors,
    });
    return;
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.username, parsedBody.data.username),
  });

  if (!existingUser?.hashed_password) {
    res.status(400).json({
      error: "Incorrect username or password",
    });
    return;
  }

  const validPassword = await new Argon2id().verify(
    existingUser.hashed_password,
    parsedBody.data.password,
  );
  if (!validPassword) {
    res.status(400).json({
      error: "Incorrect username or password",
    });
    return;
  }

  const session = await lucia.createSession(existingUser.id, {});
  res
    .appendHeader(
      "Set-Cookie",
      lucia.createSessionCookie(session.id).serialize(),
    )
    .status(200)
    .end();
}
