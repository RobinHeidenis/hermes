import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createListSchema } from "~/schemas/createListSchema";
import { eq } from "drizzle-orm";
import { lists, workspaces } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";

export const listRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createListSchema)
    .mutation(async ({ ctx, input }) => {
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
          code: "NOT_FOUND",
          message: "Workspace not found",
        });

      if (
        workspace.ownerId !== ctx.session.user.id &&
        !workspace.usersToWorkspaces.some(
          ({ userId }) => userId === ctx.session.user.id,
        )
      )
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this workspace",
        });

      return ctx.db
        .insert(lists)
        .values({
          name: input.name,
          workspaceId: input.workspaceId,
        })
        .returning({ id: lists.id })
        .execute()
        .then((p) => p[0]?.id);
    }),
});
