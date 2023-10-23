import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { setItemCheckedSchema } from "~/schemas/setItemChecked";
import { eq } from "drizzle-orm";
import { items, lists } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";

export const itemRouter = createTRPCRouter({
  setItemChecked: protectedProcedure
    .input(setItemCheckedSchema)
    .mutation(async ({ ctx, input }) => {
      const list = await ctx.db.query.lists.findFirst({
        where: eq(lists.id, input.listId),
        columns: {
          id: true,
        },
        with: {
          items: {
            columns: {
              id: true,
            },
          },
          workspace: {
            columns: {
              ownerId: true,
            },
            with: {
              usersToWorkspaces: {
                columns: { userId: true },
              },
            },
          },
        },
      });

      if (!list)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "List not found",
        });

      if (
        list.workspace.ownerId !== ctx.session.user.id &&
        !list.workspace.usersToWorkspaces.some(
          (r) => r.userId === ctx.session.user.id,
        )
      )
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have access to this list",
        });

      if (!list.items.find((i) => i.id === input.itemId))
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "That item was not found in this list",
        });

      return ctx.db
        .update(items)
        .set({ checked: input.checked })
        .where(eq(items.id, input.itemId))
        .returning({ id: items.id, checked: items.checked })
        .execute()
        .then((i) => i[0]);
    }),
});
