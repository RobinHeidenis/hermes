import {
  numeric,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { receiptItems, workspaces } from "~/server/db/schema";

export const categoryEnum = pgEnum("category", [
  "household",
  "groceries",
  "snacks",
  "other",
]);
export const receipts = pgTable("receipts", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id),
  createdAt: timestamp("created_at").defaultNow(),
  name: varchar("name", { length: 50 }),
  price: numeric("price", { precision: 8, scale: 2 }), // Maximum value of 999.999,99
  category: categoryEnum("category").default("other").notNull(),
});

export const receiptsRelations = relations(receipts, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [receipts.workspaceId],
    references: [workspaces.id],
  }),
  items: many(receiptItems),
}));
