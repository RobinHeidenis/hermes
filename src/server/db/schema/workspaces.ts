import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { lists, users, usersToWorkspaces } from "~/server/db/schema";
import { loyaltyCards } from "~/server/db/schema/loyaltyCards";

export const workspaces = pgTable("workspaces", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 50 }).notNull(),
  defaultListId: uuid("default_list_id"),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const workspacesRelations = relations(workspaces, ({ many, one }) => ({
  usersToWorkspaces: many(usersToWorkspaces),
  owner: one(users, {
    fields: [workspaces.ownerId],
    references: [users.id],
  }),
  lists: many(lists),
  loyaltyCards: many(loyaltyCards),
  defaultList: one(lists, {
    fields: [workspaces.defaultListId],
    references: [lists.id],
  }),
}));
