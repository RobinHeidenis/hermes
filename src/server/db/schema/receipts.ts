import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { receiptItems, workspaces } from "~/server/db/schema";

export const receipts = pgTable("receipts", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const receiptsRelations = relations(receipts, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [receipts.workspaceId],
    references: [workspaces.id],
  }),
  items: many(receiptItems),
}));
