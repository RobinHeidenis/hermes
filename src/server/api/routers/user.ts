import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { eq } from "drizzle-orm";
import { users, workspaces } from "~/server/db/schema";
import { updateDefaultWorkspaceSchema } from "~/schemas/updateDefaultWorkspace";
import { TRPCError } from "@trpc/server";
import { updateUserSchema } from "~/schemas/updateUser";
import { ManagementClient } from "auth0";
import { env } from "~/env.mjs";
import { updateSession } from "@auth0/nextjs-auth0";

export const userRouter = createTRPCRouter({
  getDefaultWorkspace: protectedProcedure.query(async ({ ctx }) => {
    const { id } = ctx.session.user;

    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, id),
      columns: {},
      with: {
        defaultWorkspace: true,
      },
    });

    if (!user) return null;

    return user.defaultWorkspace;
  }),
  setDefaultWorkspace: protectedProcedure
    .input(updateDefaultWorkspaceSchema)
    .mutation(async ({ ctx, input }) => {
      // Users can set their default workspaceId to null, so check here if there's an id first, and check if that workspace exists
      if (input.workspaceId) {
        const workspace = await ctx.db.query.workspaces.findFirst({
          where: eq(workspaces.id, input.workspaceId),
          columns: {
            id: true,
            ownerId: true,
          },
          with: {
            usersToWorkspaces: {
              columns: {
                userId: true,
              },
            },
          },
        });

        if (!workspace)
          throw new TRPCError({
            message: "Workspace not found",
            code: "NOT_FOUND",
          });

        if (
          workspace.ownerId !== ctx.session.user.id &&
          !workspace.usersToWorkspaces.find(
            (u) => u.userId === ctx.session.user.id,
          )
        )
          throw new TRPCError({
            message:
              "You don't have permission to set that workspace as your default",
            code: "UNAUTHORIZED",
          });
      }

      return ctx.db
        .update(users)
        .set({ defaultWorkspaceId: input.workspaceId })
        .where(eq(users.id, ctx.session.user.id));
    }),
  updateUser: protectedProcedure
    .input(updateUserSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.id)
        throw new TRPCError({
          message: "User not found",
          code: "NOT_FOUND",
        });

      const client = new ManagementClient({
        domain: env.AUTH0_DOMAIN,
        clientId: env.AUTH0_CLIENT_ID,
        clientSecret: env.AUTH0_CLIENT_SECRET,
      });

      if (ctx.session.user.id.includes("discord|")) {
        await client.users.update(
          { id: ctx.session.user.id },
          { name: input.name },
        );

        await updateSession(ctx.req, ctx.res, {
          ...ctx.session,
          user: { ...ctx.session.user, name: input.name, email: input.email },
        });

        return await ctx.db
          .update(users)
          .set({
            name: input.name,
          })
          .where(eq(users.id, ctx.session.user.id));
      }

      await client.users.update(
        { id: ctx.session.user.id },
        { name: input.name, email: input.email },
      );

      await updateSession(ctx.req, ctx.res, {
        ...ctx.session,
        user: { ...ctx.session.user, name: input.name, email: input.email },
      });

      return await ctx.db
        .update(users)
        .set({
          name: input.name,
          email: input.email,
        })
        .where(eq(users.id, ctx.session.user.id));
    }),
});
