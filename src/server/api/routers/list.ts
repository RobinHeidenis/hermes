import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createListSchema } from "~/schemas/createListSchema";
import { asc, eq } from "drizzle-orm";
import { items, lists, workspaces } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { getListSchema } from "~/schemas/getList";

export const listRouter = createTRPCRouter({
  getList: protectedProcedure
    .input(getListSchema)
    .query(async ({ ctx, input }) => {
      const list = await ctx.db.query.lists.findFirst({
        where: eq(lists.id, input.listId),
        columns: {
          id: true,
          name: true,
        },
        with: {
          items: {
            columns: {
              id: true,
              name: true,
              price: true,
              quantity: true,
              checked: true,
              externalUrl: true,
              position: true,
            },
            orderBy: [asc(items.position)],
          },
        },
      });

      if (!list)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "List not found",
        });

      return list;
    }),
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
