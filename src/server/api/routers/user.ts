import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { eq } from "drizzle-orm";
import { workspaces } from "~/server/db/schema";

export const userRouter = createTRPCRouter({
  getDefaultWorkspace: protectedProcedure.query(({ ctx }) => {
    const { defaultWorkspaceId } = ctx.session.user;

    if (!defaultWorkspaceId) return null;

    return ctx.db.query.workspaces.findFirst({
      where: eq(workspaces.id, defaultWorkspaceId),
      columns: {
        name: true,
      },
    });
  }),
});
