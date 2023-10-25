import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { setItemCheckedSchema } from "~/schemas/setItemChecked";
import { eq } from "drizzle-orm";
import { items, lists } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { deleteItemSchema } from "~/schemas/deleteItem";
import { createItemSchema } from "~/schemas/createItem";
import { editItemSchema } from "~/schemas/editItem";

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
  deleteItem: protectedProcedure
    .input(deleteItemSchema)
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

      return ctx.db.delete(items).where(eq(items.id, input.itemId)).execute();
    }),
  create: protectedProcedure
    .input(createItemSchema)
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
              position: true,
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

      const maxPosition = list.items.reduce(
        (max, item) => Math.max(max, item.position),
        0,
      );

      return ctx.db
        .insert(items)
        .values({
          listId: input.listId,
          name: input.name,
          quantity: input.quantity,
          price: input.price?.toString(),
          externalUrl: input.url,
          position: maxPosition + 1,
        })
        .returning({
          id: items.id,
          name: items.name,
          quantity: items.quantity,
          price: items.price,
          externalUrl: items.externalUrl,
          position: items.position,
          checked: items.checked,
        })
        .execute()
        .then((i) => i[0]);
    }),
  edit: protectedProcedure
    .input(editItemSchema)
    .mutation(async ({ ctx, input }) => {
      const item = await ctx.db.query.items.findFirst({
        where: eq(items.id, input.id),
        columns: {
          id: true,
        },
        with: {
          list: {
            columns: {
              id: true,
            },
            with: {
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
          },
        },
      });

      if (!item)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Item not found",
        });

      if (
        item.list.workspace.ownerId !== ctx.session.user.id &&
        !item.list.workspace.usersToWorkspaces.some(
          (r) => r.userId === ctx.session.user.id,
        )
      )
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have access to this list",
        });

      return ctx.db
        .update(items)
        .set({
          name: input.name,
          quantity: input.quantity ?? null,
          price: input.price?.toString() ?? null,
          externalUrl: input.url ?? null,
        })
        .where(eq(items.id, input.id))
        .returning({
          id: items.id,
          name: items.name,
          quantity: items.quantity,
          price: items.price,
          externalUrl: items.externalUrl,
          position: items.position,
        });
    }),
});
