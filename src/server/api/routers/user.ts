import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { eq } from "drizzle-orm";
import { users, workspaces } from "~/server/db/schema";
import { updateDefaultWorkspaceSchema } from "~/schemas/updateDefaultWorkspace";
import { TRPCError } from "@trpc/server";
import { updateUserSchema } from "~/schemas/updateUser";

export const userRouter = createTRPCRouter({
  getDefaultWorkspace: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.user.id),
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
          workspace.ownerId !== ctx.user.id &&
          !workspace.usersToWorkspaces.find((u) => u.userId === ctx.user.id)
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
        .where(eq(users.id, ctx.user.id));
    }),
  updateUser: protectedProcedure
    .input(updateUserSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user.id)
        throw new TRPCError({
          message: "User not found",
          code: "NOT_FOUND",
        });

      // TODO: Fix this whole thing to use lucia

      return await ctx.db
        .update(users)
        .set({
          name: input.name,
          email: input.email,
        })
        .where(eq(users.id, ctx.user.id));
    }),
  getMenuData: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.user.id),
      columns: {
        id: true,
      },
      with: {
        ownedWorkspaces: {
          columns: {
            id: true,
            name: true,
          },
          with: {
            lists: {
              columns: {
                id: true,
                name: true,
              },
            },
            loyaltyCards: {
              columns: {
                id: true,
                name: true,
                store: true,
                barcode: true,
                isQR: true,
              },
            },
          },
        },
        usersToWorkspaces: {
          with: {
            workspace: {
              columns: {
                id: true,
                name: true,
              },
              with: {
                lists: {
                  columns: {
                    id: true,
                    name: true,
                  },
                },
                loyaltyCards: {
                  columns: {
                    id: true,
                    name: true,
                    store: true,
                    barcode: true,
                    isQR: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "That user was not found",
      });

    return {
      workspaces: [
        ...user.ownedWorkspaces,
        ...user.usersToWorkspaces.map((r) => r.workspace),
      ],
    };
  }),
});
