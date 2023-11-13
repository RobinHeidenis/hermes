import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { items, workspaces } from "~/server/db/schema";
import { loyaltyCards } from "~/server/db/schema/loyaltyCards";

export const lists = pgTable("lists", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  name: text("name").default("Shopping List"),
  defaultLoyaltyCardId: uuid("default_loyalty_card").references(
    () => loyaltyCards.id,
    { onDelete: "set null" },
  ),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const listsRelations = relations(lists, ({ many, one }) => ({
  workspace: one(workspaces, {
    fields: [lists.workspaceId],
    references: [workspaces.id],
  }),
  defaultLoyaltyCard: one(loyaltyCards, {
    fields: [lists.defaultLoyaltyCardId],
    references: [loyaltyCards.id],
  }),
  items: many(items),
}));
