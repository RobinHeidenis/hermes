import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createListSchema } from "~/schemas/createList";
import { updatePositionsSchema } from "~/schemas/updatePositions";
import { and, asc, eq } from "drizzle-orm";
import { items, lists, workspaces } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { getListSchema } from "~/schemas/getList";
import { listIdSchema } from "~/schemas/listId";
import { updateListSchema } from "~/schemas/updateList";

export const listRouter = createTRPCRouter({
  getList: protectedProcedure
    .input(getListSchema)
    .query(async ({ ctx, input }) => {
      const list = await ctx.db.query.lists.findFirst({
        where: eq(lists.id, input.listId),
        columns: {
          id: true,
          name: true,
          workspaceId: true,
        },
        with: {
          workspace: {
            columns: { ownerId: true },
          },
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
          defaultLoyaltyCard: {
            columns: {
              id: true,
              name: true,
              barcode: true,
              isQR: true,
              store: true,
            },
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
  updatePositions: protectedProcedure
    .input(updatePositionsSchema)
    .mutation(({ ctx, input }) => {
      const itemUpdatePromises = input.items.map(({ id, position }) => {
        return ctx.db.update(items).set({ position }).where(eq(items.id, id));
      });

      return Promise.all(itemUpdatePromises);
    }),
  deleteCheckedItems: protectedProcedure
    .input(listIdSchema)
    .mutation(async ({ ctx, input }) => {
      const list = await ctx.db.query.lists.findFirst({
        columns: {
          id: true,
        },
        with: {
          workspace: {
            columns: { ownerId: true },
            with: { usersToWorkspaces: { columns: { userId: true } } },
          },
        },
      });

      if (!list)
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "The list you're trying to delete all checked items from could not be found",
        });

      if (
        ctx.session.user.id !== list.workspace.ownerId &&
        !list.workspace.usersToWorkspaces.find(
          (r) => r.userId === ctx.session.user.id,
        )
      )
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You do not have access to delete all checked items from this list",
        });

      return ctx.db
        .delete(items)
        .where(and(eq(items.listId, input.listId), eq(items.checked, true)));
    }),
  deleteAllItems: protectedProcedure
    .input(listIdSchema)
    .mutation(async ({ ctx, input }) => {
      const list = await ctx.db.query.lists.findFirst({
        columns: {
          id: true,
        },
        with: {
          workspace: {
            columns: { ownerId: true },
            with: { usersToWorkspaces: { columns: { userId: true } } },
          },
        },
      });

      if (!list)
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "The list you're trying to delete all items from could not be found",
        });

      if (
        ctx.session.user.id !== list.workspace.ownerId &&
        !list.workspace.usersToWorkspaces.find(
          (r) => r.userId === ctx.session.user.id,
        )
      )
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to delete all items from this list",
        });

      return ctx.db.delete(items).where(eq(items.listId, input.listId));
    }),
  delete: protectedProcedure
    .input(listIdSchema)
    .mutation(async ({ ctx, input }) => {
      const list = await ctx.db.query.lists.findFirst({
        columns: {
          id: true,
        },
        with: {
          workspace: {
            columns: { ownerId: true },
            with: { usersToWorkspaces: { columns: { userId: true } } },
          },
        },
      });

      if (!list)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The list you're trying to delete could not be found",
        });

      if (
        ctx.session.user.id !== list.workspace.ownerId &&
        !list.workspace.usersToWorkspaces.find(
          (r) => r.userId === ctx.session.user.id,
        )
      )
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to delete this list",
        });

      return ctx.db.delete(lists).where(eq(lists.id, input.listId));
    }),
  update: protectedProcedure
    .input(updateListSchema)
    .mutation(async ({ ctx, input }) => {
      const list = await ctx.db.query.lists.findFirst({
        columns: {
          id: true,
        },
        with: {
          workspace: {
            columns: { ownerId: true, id: true },
            with: {
              usersToWorkspaces: { columns: { userId: true } },
              loyaltyCards: { columns: { id: true } },
            },
          },
        },
        where: eq(lists.id, input.listId),
      });

      if (!list)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The list you're trying to update could not be found",
        });

      if (
        ctx.session.user.id !== list.workspace.ownerId &&
        !list.workspace.usersToWorkspaces.find(
          (r) => r.userId === ctx.session.user.id,
        )
      )
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to update this list",
        });

      if (
        input.defaultLoyaltyCardId &&
        !list.workspace.loyaltyCards.find(
          (c) => c.id === input.defaultLoyaltyCardId,
        )
      )
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "The loyalty card you're trying to set as default was not found",
        });

      return ctx.db
        .update(lists)
        .set({
          name: input.name,
          defaultLoyaltyCardId: input.defaultLoyaltyCardId,
        })
        .where(eq(lists.id, input.listId));
    }),
});
