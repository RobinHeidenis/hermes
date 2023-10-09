// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {integer, numeric, pgTable, primaryKey, text, timestamp, uuid} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  externalId: text('external_id').unique(),
  defaultWorkspaceId: uuid('default_workspace_id'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  usersToWorkspaces: many(usersToWorkspaces),
  ownedWorkspaces: many(workspaces),
  defaultWorkspace: one(workspaces, {
    fields: [users.defaultWorkspaceId],
    references: [workspaces.id],
  })
}));

export const workspaces = pgTable('workspaces', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  defaultListId: uuid('default_list_id'),
  ownerId: uuid('owner_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
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

export const usersToWorkspaces = pgTable('users_to_workspaces', {
    userId: uuid('user_id').notNull().references(() => users.id),
    workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id),
  }, (t) => ({
    pk: primaryKey(t.userId, t.workspaceId),
  }),
);

export const usersToWorkspacesRelations = relations(usersToWorkspaces, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [usersToWorkspaces.workspaceId],
    references: [workspaces.id],
  }),
  user: one(users, {
    fields: [usersToWorkspaces.userId],
    references: [users.id],
  }),
}));

export const lists = pgTable('lists', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id),
  name: text('name').default('Shopping List'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const listsRelations = relations(lists, ({ many, one }) => ({
  workspace: one(workspaces, {
    fields: [lists.workspaceId],
    references: [workspaces.id],
  }),
  items: many(items),
}));

export const items = pgTable('items', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  quantity: text('quantity'),
  price: numeric('price', {precision: 7, scale: 2}),
  externalUrl: text('external_url'),
  position: integer('position').notNull(),
  listId: uuid('list_id').notNull().references(() => lists.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const itemsRelations = relations(items, ({ one }) => ({
  list: one(lists, {
    fields: [items.listId],
    references: [lists.id],
  })
}));

export const receipts = pgTable('receipts', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const receiptsRelations = relations(receipts, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [receipts.workspaceId],
    references: [workspaces.id],
  }),
  items: many(receiptItems),
}));

export const receiptItems = pgTable('receipt_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  receiptId: uuid('receipt_id').notNull().references(() => receipts.id),
  name: text('name').notNull(),
  quantity: text('quantity'),
  price: numeric('price', {precision: 7, scale: 2}),
  category: text('category'),
});

export const receiptItemsRelations = relations(receiptItems, ({ one }) => ({
  receipt: one(receipts, {
    fields: [receiptItems.receiptId],
    references: [receipts.id],
  })
}));