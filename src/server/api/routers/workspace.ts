import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { eq } from "drizzle-orm";
import { usersToWorkspaces, workspaces } from "~/server/db/schema";
import { createWorkspaceSchema } from "~/schemas/createWorkspace";

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
});
