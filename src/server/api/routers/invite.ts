import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { workspaceIdSchema } from "~/schemas/workspaceId";
import { eq, sql } from "drizzle-orm";
import { invites, usersToWorkspaces, workspaces } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { inviteIdSchema } from "~/schemas/inviteId";

export const inviteRouter = createTRPCRouter({
  createInvite: protectedProcedure
    .input(workspaceIdSchema)
    .mutation(async ({ ctx, input }) => {
      const workspace = await ctx.db.query.workspaces.findFirst({
        where: eq(workspaces.id, input.workspaceId),
        columns: { id: true, ownerId: true },
        with: { usersToWorkspaces: { columns: { userId: true } } },
      });

      if (!workspace) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "The workspace you're trying to create an invite for cannot be found",
        });
      }

      if (
        workspace.ownerId !== ctx.user.id &&
        !workspace.usersToWorkspaces.find((u) => u.userId === ctx.user.id)
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not allowed to create invites for this workspace",
        });
      }

      return ctx.db.insert(invites).values({
        workspaceId: input.workspaceId,
      });
    }),
  getInvite: protectedProcedure
    .input(inviteIdSchema)
    .query(async ({ ctx, input }) => {
      const invite = await ctx.db.query.invites.findFirst({
        where: eq(invites.id, input.inviteId),
        with: {
          workspace: {
            columns: {
              id: true,
              name: true,
            },
            with: {
              owner: {
                columns: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
              usersToWorkspaces: {
                columns: { userId: false },
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
            },
          },
        },
      });

      if (!invite)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "That invite was not found",
        });

      if (
        invite.workspace.owner.id === ctx.user.id ||
        invite.workspace.usersToWorkspaces.find(
          (r) => r.user.id === ctx.user.id,
        )
      ) {
        return {
          code: "CONFLICT",
          message: "You're already in this list!",
        };
      }

      return invite;
    }),
  acceptInvite: protectedProcedure
    .input(inviteIdSchema)
    .mutation(async ({ ctx, input }) => {
      const invite = await ctx.db.query.invites.findFirst({
        where: eq(invites.id, input.inviteId),
        columns: {
          id: true,
          workspaceId: true,
        },
        with: {
          workspace: {
            columns: {
              ownerId: true,
            },
            with: {
              usersToWorkspaces: {
                columns: {
                  userId: true,
                },
              },
            },
          },
        },
      });

      if (!invite)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The invite you're trying to accept was not found",
        });

      if (
        ctx.user.id === invite.workspace.ownerId ||
        invite.workspace.usersToWorkspaces.find((r) => r.userId === ctx.user.id)
      )
        throw new TRPCError({
          code: "CONFLICT",
          message: "You are already in this workspace",
        });

      return ctx.db
        .insert(usersToWorkspaces)
        .values({
          workspaceId: invite.workspaceId,
          userId: ctx.user.id,
        })
        .returning({ workspaceId: usersToWorkspaces.workspaceId });
    }),
  getInviteForWorkspace: protectedProcedure
    .input(workspaceIdSchema)
    .query(async ({ ctx, input }) => {
      const workspace = await ctx.db.query.workspaces.findFirst({
        where: eq(workspaces.id, input.workspaceId),
        columns: {
          ownerId: true,
        },
        with: {
          usersToWorkspaces: { columns: { userId: true } },
        },
      });

      if (!workspace)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "That workspace was not found",
        });

      if (
        workspace.ownerId !== ctx.user.id &&
        !workspace.usersToWorkspaces.find((r) => r.userId === ctx.user.id)
      )
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You're not allowed to see the invites for this workspace",
        });

      return (
        (await ctx.db.query.invites.findFirst({
          where: eq(invites.workspaceId, input.workspaceId),
          columns: {
            id: true,
            createdAt: true,
          },
        })) ?? null
      );
    }),
  deleteInvite: protectedProcedure
    .input(inviteIdSchema)
    .mutation(async ({ ctx, input }) => {
      const invite = await ctx.db.query.invites.findFirst({
        where: eq(invites.id, input.inviteId),
        with: {
          workspace: {
            columns: {
              ownerId: true,
            },
          },
        },
      });

      if (!invite) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The invite you're trying to delete cannot be found",
        });
      }

      if (ctx.user.id !== invite.workspace.ownerId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You're not allowed to delete that invite",
        });
      }

      return ctx.db.delete(invites).where(eq(invites.id, input.inviteId));
    }),
  regenerateInvite: protectedProcedure
    .input(inviteIdSchema)
    .mutation(async ({ ctx, input }) => {
      const invite = await ctx.db.query.invites.findFirst({
        where: eq(invites.id, input.inviteId),
        with: {
          workspace: {
            columns: { ownerId: true },
          },
        },
      });

      if (!invite)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "That invite was not found",
        });

      if (ctx.user.id !== invite.workspace.ownerId)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You're not allowed to regenerate that invite",
        });

      await ctx.db
        .update(invites)
        .set({ id: sql`DEFAULT`, createdAt: new Date() })
        .where(eq(invites.id, invite.id));
    }),
});
