import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { loginSchema } from "~/schemas/login";
import { eq } from "drizzle-orm";
import { users } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { Argon2id } from "oslo/password";
import { lucia } from "~/auth";
import { signupSchema } from "~/schemas/signup";
import { generateId } from "lucia";

export const authRouter = createTRPCRouter({
  login: publicProcedure.input(loginSchema).mutation(async ({ ctx, input }) => {
    const existingUser = await ctx.db.query.users.findFirst({
      where: eq(users.username, input.username),
    });

    if (!existingUser?.hashed_password) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Incorrect username or password",
      });
    }

    const validPassword = await new Argon2id().verify(
      existingUser.hashed_password,
      input.password,
    );
    if (!validPassword) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Incorrect username or password",
      });
    }

    const session = await lucia.createSession(existingUser.id, {});
    ctx.res.appendHeader(
      "Set-Cookie",
      lucia.createSessionCookie(session.id).serialize(),
    );
  }),
  logout: protectedProcedure.mutation(async ({ ctx }) => {
    await lucia.invalidateSession(ctx.session.id);
    ctx.res.setHeader(
      "Set-Cookie",
      lucia.createBlankSessionCookie().serialize(),
    );
  }),
  signup: publicProcedure
    .input(signupSchema)
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.db.query.users.findFirst({
        where: eq(users.username, input.username),
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Username is already registered",
        });
      }

      const hashedPassword = await new Argon2id().hash(input.password);
      const userId = generateId(15);

      await ctx.db.insert(users).values({
        id: userId,
        username: input.username,
        hashed_password: hashedPassword,
        name: input.username,
        image: `https://ui-avatars.com/api?background=random&name=${input.username}`,
        email: input.email,
      });

      const session = await lucia.createSession(userId, {});
      ctx.res.appendHeader(
        "Set-Cookie",
        lucia.createSessionCookie(session.id).serialize(),
      );
    }),
});
