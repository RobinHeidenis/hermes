import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { and, eq } from "drizzle-orm";
import { usersToWorkspaces, workspaces } from "~/server/db/schema";
import { createWorkspaceSchema } from "~/schemas/createWorkspace";
import { getWorkspaceSchema } from "~/schemas/getWorkspace";
import { TRPCError } from "@trpc/server";
import { listSettingSchema } from "~/schemas/listSettings";
import { deleteWorkspaceSchema } from "~/schemas/deleteWorkspace";
import { z } from "zod";
import { workspaceIdSchema } from "~/schemas/workspaceId";

export const workspaceRouter = createTRPCRouter({
  getWorkspaces: protectedProcedure.query(async ({ ctx }) => {
    const ownedWorkspaces = (
      await ctx.db.query.workspaces.findMany({
        where: eq(workspaces.ownerId, ctx.session.user.id),
        with: {
          usersToWorkspaces: {
            columns: {
              userId: true,
            },
          },
          lists: {
            columns: {
              id: true,
            },
          },
        },
      })
    ).map(({ usersToWorkspaces, lists, ...relationWorkspace }) => ({
      ...relationWorkspace,
      lists: lists.length,
      users: usersToWorkspaces.length,
    }));

    const collaboratingWorkspaces = (
      await ctx.db.query.usersToWorkspaces.findMany({
        where: eq(usersToWorkspaces.userId, ctx.session.user.id),
        with: {
          workspace: {
            with: {
              usersToWorkspaces: {
                columns: {
                  userId: true,
                },
              },
              lists: {
                columns: {
                  id: true,
                },
              },
            },
          },
        },
      })
    ).map(
      ({ workspace: { usersToWorkspaces, lists, ...relationWorkspace } }) => ({
        ...relationWorkspace,
        lists: lists.length,
        users: usersToWorkspaces.length,
      }),
    );

    return {
      ownedWorkspaces,
      collaboratingWorkspaces,
    };
  }),
  create: protectedProcedure
    .input(createWorkspaceSchema)
    .mutation(async ({ ctx, input }) => {
      const p = await ctx.db
        .insert(workspaces)
        .values({ name: input.name, ownerId: ctx.session.user.id })
        .returning({ id: workspaces.id })
        .execute();

      return p[0]?.id;
    }),
  getWorkspace: protectedProcedure
    .input(getWorkspaceSchema)
    .query(async ({ ctx, input }) => {
      const workspace = await ctx.db.query.workspaces.findFirst({
        where: eq(workspaces.id, input.workspaceId),
        columns: {
          id: true,
          name: true,
          defaultListId: true,
        },
        with: {
          owner: {
            columns: {
              id: true,
              name: true,
              image: true,
            },
          },
          lists: {
            columns: {
              id: true,
              name: true,
            },
            with: {
              items: {
                columns: {
                  id: true,
                },
              },
            },
          },
          usersToWorkspaces: {
            columns: {
              userId: false,
            },
            with: {
              user: {
                columns: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
          loyaltyCards: {
            columns: {
              id: true,
              name: true,
              store: true,
              barcode: true,
            },
          },
        },
      });

      if (!workspace)
        throw new TRPCError({
          message: "No workspace found",
          code: "NOT_FOUND",
        });

      if (
        workspace.owner.id !== ctx.session.user.id &&
        !workspace.usersToWorkspaces.find(
          (r) => r.user.id === ctx.session.user.id,
        )
      )
        throw new TRPCError({
          message: "You don't have permission to view that workspace",
          code: "UNAUTHORIZED",
        });

      return {
        id: workspace.id,
        name: workspace.name,
        defaultListId: workspace.defaultListId,
        users: {
          owner: workspace.owner,
          contributors: workspace.usersToWorkspaces.map((r) => r.user),
        },
        lists: workspace.lists,
        loyaltyCards: workspace.loyaltyCards,
      };
    }),
  updateListSettings: protectedProcedure
    .input(listSettingSchema)
    .mutation(async ({ ctx, input }) => {
      const workspace = await ctx.db.query.workspaces.findFirst({
        where: eq(workspaces.id, input.workspaceId),
        columns: {
          id: true,
          ownerId: true,
        },
        with: {
          lists: {
            columns: {
              id: true,
            },
          },
          usersToWorkspaces: {
            columns: {
              userId: true,
            },
          },
        },
      });

      if (!workspace)
        throw new TRPCError({
          message: "The workspace you're trying to update was not found",
          code: "NOT_FOUND",
        });

      if (
        workspace.ownerId !== ctx.session.user.id &&
        !workspace.usersToWorkspaces.find(
          (r) => r.userId === ctx.session.user.id,
        )
      )
        throw new TRPCError({
          message: "You don't have permission to update that list",
          code: "UNAUTHORIZED",
        });

      if (input.listId && !workspace.lists.find((l) => l.id === input.listId))
        throw new TRPCError({
          message: "The list you're trying to set as default was not found",
          code: "NOT_FOUND",
        });

      return ctx.db
        .update(workspaces)
        .set({
          defaultListId: input.listId,
          name: input.name,
        })
        .where(eq(workspaces.id, input.workspaceId))
        .execute();
    }),
  delete: protectedProcedure
    .input(deleteWorkspaceSchema)
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
          message: "The workspace you're trying to delete was not found",
          code: "NOT_FOUND",
        });

      if (workspace.ownerId !== ctx.session.user.id)
        throw new TRPCError({
          message: "You don't have permission to delete that workspace",
          code: "UNAUTHORIZED",
        });

      return ctx.db
        .delete(workspaces)
        .where(eq(workspaces.id, input.workspaceId));
    }),
  leave: protectedProcedure
    .input(deleteWorkspaceSchema)
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
          message: "The workspace you're trying to leave was not found",
          code: "NOT_FOUND",
        });

      if (
        workspace.ownerId === ctx.session.user.id ||
        !workspace.usersToWorkspaces.find(
          (r) => r.userId === ctx.session.user.id,
        )
      )
        throw new TRPCError({
          message: "You don't have permission to leave that workspace",
          code: "UNAUTHORIZED",
        });

      return ctx.db
        .delete(usersToWorkspaces)
        .where(
          and(
            eq(usersToWorkspaces.workspaceId, input.workspaceId),
            eq(usersToWorkspaces.userId, ctx.session.user.id),
          ),
        );
    }),
  kickUser: protectedProcedure
    .input(
      z.object({ userId: z.string().uuid(), workspaceId: z.string().uuid() }),
    )
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
          message: "The workspace you're trying kick a user from was not found",
          code: "NOT_FOUND",
        });

      if (workspace.ownerId !== ctx.session.user.id)
        throw new TRPCError({
          message: "You don't have permission to delete that list",
          code: "UNAUTHORIZED",
        });

      if (!workspace.usersToWorkspaces.find((r) => r.userId === input.userId))
        throw new TRPCError({
          message: "That user was not found in this list",
          code: "NOT_FOUND",
        });

      return ctx.db
        .delete(usersToWorkspaces)
        .where(
          and(
            eq(usersToWorkspaces.userId, input.userId),
            eq(usersToWorkspaces.workspaceId, input.workspaceId),
          ),
        );
    }),
  getLoyaltyCards: protectedProcedure
    .input(workspaceIdSchema)
    .query(async ({ ctx, input }) => {
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
          loyaltyCards: {
            columns: {
              id: true,
              name: true,
              store: true,
              barcode: true,
            },
          },
        },
      });

      if (!workspace)
        throw new TRPCError({
          message:
            "The workspace you're trying to get loyalty cards from was not found",
          code: "NOT_FOUND",
        });

      if (
        workspace.ownerId !== ctx.session.user.id &&
        !workspace.usersToWorkspaces.find(
          (r) => r.userId === ctx.session.user.id,
        )
      )
        throw new TRPCError({
          message:
            "You're not allowed to get loyalty cards from this workspace",
          code: "UNAUTHORIZED",
        });

      return workspace.loyaltyCards;
    }),
});
