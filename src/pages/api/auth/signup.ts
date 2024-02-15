import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { Argon2id } from "oslo/password";
import { generateId } from "lucia";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { users } from "~/server/db/schema";
import { lucia } from "~/auth";

const signupSchema = z.object({
  username: z.string().min(1).max(30),
  email: z.string().email().min(1),
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

  const parsedBody = signupSchema.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(400).json({
      error: "Validation failed on username, password, or email",
      zodErrors: parsedBody.error.errors,
    });
    return;
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.username, parsedBody.data.username),
  });

  if (existingUser) {
    res.status(409).json({ error: "Username is already registered" });
    return;
  }

  const hashedPassword = await new Argon2id().hash(parsedBody.data.password);
  const userId = generateId(15);

  await db.insert(users).values({
    id: userId,
    username: parsedBody.data.username,
    hashed_password: hashedPassword,
    name: parsedBody.data.username,
    image: `https://ui-avatars.com/api?background=random&name=${parsedBody.data.username}`,
    email: parsedBody.data.email,
  });

  const session = await lucia.createSession(userId, {});
  res
    .appendHeader(
      "Set-Cookie",
      lucia.createSessionCookie(session.id).serialize(),
    )
    .status(200)
    .end();
}
