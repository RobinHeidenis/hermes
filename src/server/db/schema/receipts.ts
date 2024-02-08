import {
  boolean,
  numeric,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { receiptItems, workspaces } from "~/server/db/schema";
import {
  ArmchairIcon,
  BriefcaseIcon,
  CakeIcon,
  CarIcon,
  CoinsIcon,
  HomeIcon,
  PawPrintIcon,
  StoreIcon,
  UtensilsIcon,
  WalletIcon,
} from "lucide-react";

export const categoryEnum = pgEnum("category", [
  "groceries",
  "household",
  "snacks",
  "leisure",
  "fixed",
  "restaurant",
  "transport",
  "professional",
  "pets",
  "other",
]);
export const receipts = pgTable("receipts", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id),
  monthly: boolean("monthly").default(false), // Whether this is a monthly expense that is spent for a whole month, not just on a specific day (e.g. rent, internet, etc.)
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

export const categoryToIconMap = {
  groceries: { Icon: StoreIcon, color: "blue" },
  household: { Icon: HomeIcon, color: "green" },
  snacks: { Icon: CakeIcon, color: "orange" },
  leisure: { Icon: ArmchairIcon, color: "violet" },
  restaurant: { Icon: UtensilsIcon, color: "pink" },
  fixed: { Icon: WalletIcon, color: "indigo" },
  transport: { Icon: CarIcon, color: "cyan" },
  professional: { Icon: BriefcaseIcon, color: "teal" },
  pets: { Icon: PawPrintIcon, color: "yellow" },
  other: { Icon: CoinsIcon, color: "red" },
};
