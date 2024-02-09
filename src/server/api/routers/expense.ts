import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getExpensesSchema } from "~/schemas/getExpenses";
import { and, asc, desc, eq, gt } from "drizzle-orm";
import { receipts, workspaces } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import type { ManipulateType } from "dayjs";
import dayjs from "dayjs";
import { workspaceIdSchema } from "~/schemas/workspaceId";
import { createExpenseSchema } from "~/schemas/createExpense";
import { deleteExpenseSchema } from "~/schemas/deleteExpense";
import { updateExpenseSchema } from "~/schemas/updateExpense";
import { z } from "zod";
import groupBy from "object.groupby";

export const expenseRouter = createTRPCRouter({
  monthStats: protectedProcedure
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

      const expenses = await ctx.db.query.receipts.findMany({
        where: and(
          eq(receipts.workspaceId, input.workspaceId),
          gt(
            receipts.createdAt,
            dayjs().startOf("month").subtract(1, "month").toDate(),
          ),
        ),
        orderBy: desc(receipts.createdAt),
      });

      const grouped = groupBy(expenses, ({ createdAt }) => {
        if (dayjs(createdAt).isAfter(dayjs().startOf("month")))
          return "current";
        else return "previous";
      });

      const spentThisMonth = grouped.current.reduce(
        (prev, curr) => prev + Number(curr.price),
        0,
      );
      const spentPreviousMonth = grouped.previous.reduce(
        (prev, curr) => prev + Number(curr.price),
        0,
      );

      return {
        spentThisMonth,
        spentPreviousMonth,
        amountThisMonth: grouped.current.length,
        amountPreviousMonth: grouped.previous.length,
      };
    }),
  paginatedExpenses: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        offset: z.number(),
      }),
    )
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

      const expenses = await ctx.db.query.receipts.findMany({
        where: eq(receipts.workspaceId, input.workspaceId),
        orderBy: [desc(receipts.createdAt), asc(receipts.name)],
        offset: input.offset,
        limit: 51,
      });

      let hasNextPage = false;
      if (expenses.length > 50) {
        expenses.pop();
        hasNextPage = true;
      }

      return {
        expenses: expenses,
        hasNextPage,
        hasPreviousPage: input.offset > 49,
      };
    }),
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
        orderBy: [desc(receipts.createdAt), asc(receipts.name)],
        limit: 50,
      });
    }),
  updateExpense: protectedProcedure
    .input(updateExpenseSchema)
    .mutation(async ({ ctx, input }) => {
      const receipt = await ctx.db.query.receipts.findFirst({
        where: eq(receipts.id, input.id),
        with: {
          workspace: {
            columns: { ownerId: true },
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

      if (!receipt)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "That receipt was not found",
        });

      if (
        ctx.session.user.id !== receipt.workspace.ownerId &&
        !receipt.workspace.usersToWorkspaces.find(
          (r) => r.userId === ctx.session.user.id,
        )
      )
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have access to update this expense",
        });

      return ctx.db
        .update(receipts)
        .set({
          category: input.category,
          name: input.name,
          price: input.price.toString(),
          monthly: input.monthly,
          createdAt: input.monthly
            ? dayjs(input.date).endOf("month").subtract(1, "hour").toDate()
            : input.date,
        })
        .where(eq(receipts.id, input.id));
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
  deleteExpense: protectedProcedure
    .input(deleteExpenseSchema)
    .mutation(async ({ ctx, input }) => {
      const receipt = await ctx.db.query.receipts.findFirst({
        where: eq(workspaces.id, input.expenseId),
        with: {
          workspace: {
            columns: { ownerId: true },
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

      if (!receipt)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "That receipt was not found",
        });

      if (
        ctx.session.user.id !== receipt.workspace.ownerId &&
        !receipt.workspace.usersToWorkspaces.find(
          (r) => r.userId === ctx.session.user.id,
        )
      )
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have access to delete this expense",
        });

      return ctx.db.delete(receipts).where(eq(receipts.id, input.expenseId));
    }),
});
