import {
  boolean,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { lists } from "~/server/db/schema";

export const items = pgTable("items", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  quantity: text("quantity"),
  price: numeric("price", { precision: 7, scale: 2 }),
  externalUrl: text("external_url"),
  position: integer("position").notNull(),
  checked: boolean("checked").default(false),
  listId: uuid("list_id")
    .notNull()
    .references(() => lists.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const itemsRelations = relations(items, ({ one }) => ({
  list: one(lists, {
    fields: [items.listId],
    references: [lists.id],
  }),
}));
