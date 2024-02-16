import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createLoyaltyCardSchema } from "~/schemas/createLoyaltyCard";
import { eq } from "drizzle-orm";
import { loyaltyCards, workspaces } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { editLoyaltyCardSchema } from "~/schemas/editLoyaltyCard";
import { loyaltyCardIdSchema } from "~/schemas/loyaltyCardId";
import { workspaceIdSchema } from "~/schemas/workspaceId";

export const loyaltyCardRouter = createTRPCRouter({
  createLoyaltyCard: protectedProcedure
    .input(createLoyaltyCardSchema)
    .mutation(async ({ ctx, input }) => {
      const workspace = await ctx.db.query.workspaces.findFirst({
        where: eq(workspaces.id, input.workspaceId),
        with: {
          usersToWorkspaces: { columns: { userId: true } },
        },
      });

      if (!workspace) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "That workspace was not found.",
        });
      }

      if (
        workspace.ownerId !== ctx.user.id &&
        !workspace.usersToWorkspaces.find((r) => r.userId === ctx.user.id)
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You're not allowed to create a loyalty card in this workspace",
        });
      }

      return ctx.db.insert(loyaltyCards).values({
        name: input.name,
        workspaceId: input.workspaceId,
        barcode: input.barcode,
        isQR: input.isQR,
        store: input.store,
      });
    }),
  updateLoyaltyCard: protectedProcedure
    .input(editLoyaltyCardSchema)
    .mutation(async ({ ctx, input }) => {
      const workspace = await ctx.db.query.workspaces.findFirst({
        where: eq(workspaces.id, input.workspaceId),
        columns: { ownerId: true },
        with: {
          usersToWorkspaces: { columns: { userId: true } },
          loyaltyCards: { columns: { id: true } },
        },
      });

      if (!workspace) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "The workspace you're trying to edit a loyalty card is was not found",
        });
      }

      if (
        workspace.ownerId !== ctx.user.id &&
        !workspace.usersToWorkspaces.find((r) => r.userId === ctx.user.id)
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You're not allowed to edit that loyalty card",
        });
      }

      if (!workspace.loyaltyCards.find((r) => r.id === input.loyaltyCardId)) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The loyalty card you're trying to edit was not found",
        });
      }

      return ctx.db
        .update(loyaltyCards)
        .set({
          name: input.name,
          barcode: input.barcode,
          isQR: input.isQR,
          store: input.store,
        })
        .where(eq(loyaltyCards.id, input.loyaltyCardId));
    }),
  deleteLoyaltyCard: protectedProcedure
    .input(loyaltyCardIdSchema.merge(workspaceIdSchema))
    .mutation(async ({ ctx, input }) => {
      const workspace = await ctx.db.query.workspaces.findFirst({
        where: eq(workspaces.id, input.workspaceId),
        columns: { ownerId: true },
        with: {
          usersToWorkspaces: {
            columns: { userId: true },
          },
          loyaltyCards: { columns: { id: true } },
        },
      });

      if (!workspace) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "The workspace you're trying to delete a loyalty card from was not found",
        });
      }

      if (
        workspace.ownerId !== ctx.user.id &&
        !workspace.usersToWorkspaces.find((r) => r.userId === ctx.user.id)
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You're not allowed to delete that loyalty card",
        });
      }

      if (!workspace.loyaltyCards.find((c) => c.id === input.loyaltyCardId)) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The loyalty card you're trying to delete was not found",
        });
      }

      return ctx.db
        .delete(loyaltyCards)
        .where(eq(loyaltyCards.id, input.loyaltyCardId));
    }),
});
