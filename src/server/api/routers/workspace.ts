import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { eq } from "drizzle-orm";
import { usersToWorkspaces, workspaces } from "~/server/db/schema";

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
});
