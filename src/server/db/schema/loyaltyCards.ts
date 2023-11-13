import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { workspaces } from "~/server/db/schema";
import { relations } from "drizzle-orm";

export const loyaltyCards = pgTable("loyalty_cards", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 25 }).default("Loyalty card").notNull(),
  store: varchar("store", { length: 40 }).notNull(),
  barcode: text("barcode").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const loyaltyCardsRelations = relations(loyaltyCards, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [loyaltyCards.workspaceId],
    references: [workspaces.id],
  }),
}));
