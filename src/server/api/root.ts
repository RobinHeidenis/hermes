import { createTRPCRouter } from "~/server/api/trpc";
import { workspaceRouter } from "~/server/api/routers/workspace";
import { userRouter } from "~/server/api/routers/user";
import { listRouter } from "~/server/api/routers/list";
import { itemRouter } from "~/server/api/routers/item";
import { inviteRouter } from "~/server/api/routers/invite";
import { loyaltyCardRouter } from "./routers/loyaltyCard";
import { expenseRouter } from "~/server/api/routers/expense";
import { authRouter } from "~/server/api/routers/auth";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  workspace: workspaceRouter,
  user: userRouter,
  list: listRouter,
  item: itemRouter,
  invite: inviteRouter,
  loyaltyCard: loyaltyCardRouter,
  expense: expenseRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
