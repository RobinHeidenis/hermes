import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { eq } from "drizzle-orm";
import { usersToWorkspaces, workspaces } from "~/server/db/schema";
import { createWorkspaceSchema } from "~/schemas/createWorkspace";
import { getWorkspaceSchema } from "~/schemas/getWorkspace";
import { TRPCError } from "@trpc/server";

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
          name: true,
        },
        with: {
          owner: {
            columns: {
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
        },
      });

      if (!workspace)
        throw new TRPCError({
          message: "No workspace found",
          code: "NOT_FOUND",
        });

      return {
        name: workspace.name,
        users: {
          owner: workspace.owner,
          contributors: workspace.usersToWorkspaces.map((r) => r.user),
        },
        lists: workspace.lists,
      };
    }),
});
