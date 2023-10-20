import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { eq } from "drizzle-orm";
import { users, workspaces } from "~/server/db/schema";
import { updateDefaultWorkspaceSchema } from "~/schemas/updateDefaultWorkspace";
import { TRPCError } from "@trpc/server";
import { updateUserSchema } from "~/schemas/updateUser";

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
          },
        });

        if (!workspace)
          throw new TRPCError({
            message: "Workspace not found",
            code: "NOT_FOUND",
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
      return ctx.db
        .update(users)
        .set({ name: input.name, email: input.email })
        .where(eq(users.id, ctx.session.user.id));
    }),
});
