import { createTRPCRouter } from "~/server/api/trpc";
import { workspaceRouter } from "~/server/api/routers/workspace";
import { userRouter } from "~/server/api/routers/user";
import { listRouter } from "~/server/api/routers/list";
import { itemRouter } from "~/server/api/routers/item";
import { inviteRouter } from "~/server/api/routers/invite";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  workspace: workspaceRouter,
  user: userRouter,
  list: listRouter,
  item: itemRouter,
  invite: inviteRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
