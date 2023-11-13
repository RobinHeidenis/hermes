import { pgTable, primaryKey, text, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users, workspaces } from "~/server/db/schema";

export const usersToWorkspaces = pgTable(
  "users_to_workspaces",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey(t.userId, t.workspaceId),
  }),
);

export const usersToWorkspacesRelations = relations(
  usersToWorkspaces,
  ({ one }) => ({
    workspace: one(workspaces, {
      fields: [usersToWorkspaces.workspaceId],
      references: [workspaces.id],
    }),
    user: one(users, {
      fields: [usersToWorkspaces.userId],
      references: [users.id],
    }),
  }),
);
