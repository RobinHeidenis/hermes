import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getExpensesSchema } from "~/schemas/getExpenses";
import { and, desc, eq, gt } from "drizzle-orm";
import { receipts, workspaces } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import type { ManipulateType } from "dayjs";
import dayjs from "dayjs";
import { workspaceIdSchema } from "~/schemas/workspaceId";
import { createExpenseSchema } from "~/schemas/createExpense";

export const expenseRouter = createTRPCRouter({
  getExpenses: protectedProcedure
    .input(getExpensesSchema)
    .query(async ({ ctx, input }) => {
      const workspace = await ctx.db.query.workspaces.findFirst({
        where: eq(workspaces.id, input.workspaceId),
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
      });

      if (!workspace)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "That workspace was not found",
        });

      if (
        ctx.session.user.id !== workspace.ownerId &&
        !workspace.usersToWorkspaces.find(
          (r) => r.userId === ctx.session.user.id,
        )
      )
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have access to see this workspace's expenses",
        });

      const [amount, unit] = input.period.split("-");

      return ctx.db.query.receipts.findMany({
        where: and(
          eq(receipts.workspaceId, input.workspaceId),
          gt(
            receipts.createdAt,
            dayjs()
              .subtract(Number(amount), unit as ManipulateType)
              .toDate(),
          ),
        ),
        orderBy: desc(receipts.createdAt),
      });
    }),
  getLast50Expenses: protectedProcedure
    .input(workspaceIdSchema)
    .query(async ({ ctx, input }) => {
      const workspace = await ctx.db.query.workspaces.findFirst({
        where: eq(workspaces.id, input.workspaceId),
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
      });

      if (!workspace)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "That workspace was not found",
        });

      if (
        ctx.session.user.id !== workspace.ownerId &&
        !workspace.usersToWorkspaces.find(
          (r) => r.userId === ctx.session.user.id,
        )
      )
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have access to see this workspace's expenses",
        });

      return ctx.db.query.receipts.findMany({
        where: eq(receipts.workspaceId, input.workspaceId),
        orderBy: desc(receipts.createdAt),
        limit: 50,
      });
    }),
  createExpense: protectedProcedure
    .input(createExpenseSchema)
    .mutation(async ({ ctx, input }) => {
      const workspace = await ctx.db.query.workspaces.findFirst({
        where: eq(workspaces.id, input.workspaceId),
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
      });

      if (!workspace)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "That workspace was not found",
        });

      if (
        ctx.session.user.id !== workspace.ownerId &&
        !workspace.usersToWorkspaces.find(
          (r) => r.userId === ctx.session.user.id,
        )
      )
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have access to add an expense to this workspace",
        });

      return ctx.db.insert(receipts).values({
        workspaceId: input.workspaceId,
        category: input.category,
        name: input.name,
        price: input.price.toString(),
        monthly: input.monthly,
        createdAt: input.monthly
          ? dayjs(input.date).endOf("month").subtract(1, "hour").toDate()
          : input.date,
      });
    }),
});
