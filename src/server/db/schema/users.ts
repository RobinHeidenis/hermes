import { bigint, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { usersToWorkspaces, workspaces } from "~/server/db/schema";

export const users = pgTable("users", {
  id: text("id").notNull().primaryKey(),
  discord_id: bigint("discord_id", { mode: "number" }).unique(),
  name: text("name"),
  email: text("email").notNull(),
  image: text("image"),
  defaultWorkspaceId: uuid("default_workspace_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  usersToWorkspaces: many(usersToWorkspaces),
  ownedWorkspaces: many(workspaces),
  defaultWorkspace: one(workspaces, {
    fields: [users.defaultWorkspaceId],
    references: [workspaces.id],
  }),
}));
