// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {
  integer,
  numeric,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { type AdapterAccount } from "next-auth/adapters";

export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  defaultWorkspaceId: uuid("default_workspace_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  accounts: many(accounts),
  usersToWorkspaces: many(usersToWorkspaces),
  ownedWorkspaces: many(workspaces),
  defaultWorkspace: one(workspaces, {
    fields: [users.defaultWorkspaceId],
    references: [workspaces.id],
  }),
}));

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
);

export const workspaces = pgTable("workspaces", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 50 }).notNull(),
  defaultListId: uuid("default_list_id"),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id),
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
  defaultList: one(lists, {
    fields: [workspaces.defaultListId],
    references: [lists.id],
  }),
}));

export const usersToWorkspaces = pgTable(
  "users_to_workspaces",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id),
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

export const lists = pgTable("lists", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id),
  name: text("name").default("Shopping List"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const listsRelations = relations(lists, ({ many, one }) => ({
  workspace: one(workspaces, {
    fields: [lists.workspaceId],
    references: [workspaces.id],
  }),
  items: many(items),
}));

export const items = pgTable("items", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  quantity: text("quantity"),
  price: numeric("price", { precision: 7, scale: 2 }),
  externalUrl: text("external_url"),
  position: integer("position").notNull(),
  listId: uuid("list_id")
    .notNull()
    .references(() => lists.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const itemsRelations = relations(items, ({ one }) => ({
  list: one(lists, {
    fields: [items.listId],
    references: [lists.id],
  }),
}));

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

export const receiptItems = pgTable("receipt_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  receiptId: uuid("receipt_id")
    .notNull()
    .references(() => receipts.id),
  name: text("name").notNull(),
  quantity: text("quantity"),
  price: numeric("price", { precision: 7, scale: 2 }),
  category: text("category"),
});

export const receiptItemsRelations = relations(receiptItems, ({ one }) => ({
  receipt: one(receipts, {
    fields: [receiptItems.receiptId],
    references: [receipts.id],
  }),
}));
