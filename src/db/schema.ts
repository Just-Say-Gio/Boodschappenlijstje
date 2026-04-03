import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  integer,
  jsonb,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ── Profiles ────────────────────────────────────────────────────────────────
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  emoji: text("emoji").notNull(),
  color: text("color").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const profilesRelations = relations(profiles, ({ many }) => ({
  createdLists: many(lists),
  listMemberships: many(listMembers),
  addedItems: many(items, { relationName: "addedBy" }),
  checkedItems: many(items, { relationName: "checkedBy" }),
  activityLogs: many(activityLog),
}));

// ── Lists ───────────────────────────────────────────────────────────────────
export const lists = pgTable("lists", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  shareCode: text("share_code").unique().notNull(),
  isArchived: boolean("is_archived").default(false),
  createdBy: uuid("created_by").references(() => profiles.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const listsRelations = relations(lists, ({ one, many }) => ({
  creator: one(profiles, {
    fields: [lists.createdBy],
    references: [profiles.id],
  }),
  members: many(listMembers),
  items: many(items),
  activityLogs: many(activityLog),
}));

// ── List Members (join table) ───────────────────────────────────────────────
export const listMembers = pgTable(
  "list_members",
  {
    listId: uuid("list_id")
      .notNull()
      .references(() => lists.id),
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profiles.id),
    joinedAt: timestamp("joined_at").defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.listId, table.profileId] })]
);

export const listMembersRelations = relations(listMembers, ({ one }) => ({
  list: one(lists, {
    fields: [listMembers.listId],
    references: [lists.id],
  }),
  profile: one(profiles, {
    fields: [listMembers.profileId],
    references: [profiles.id],
  }),
}));

// ── Items ───────────────────────────────────────────────────────────────────
export const items = pgTable("items", {
  id: uuid("id").primaryKey().defaultRandom(),
  listId: uuid("list_id")
    .notNull()
    .references(() => lists.id),
  name: text("name").notNull(),
  quantity: text("quantity"),
  category: text("category"),
  checked: boolean("checked").default(false),
  checkedBy: uuid("checked_by").references(() => profiles.id),
  addedBy: uuid("added_by")
    .notNull()
    .references(() => profiles.id),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const itemsRelations = relations(items, ({ one }) => ({
  list: one(lists, {
    fields: [items.listId],
    references: [lists.id],
  }),
  checkedByProfile: one(profiles, {
    fields: [items.checkedBy],
    references: [profiles.id],
    relationName: "checkedBy",
  }),
  addedByProfile: one(profiles, {
    fields: [items.addedBy],
    references: [profiles.id],
    relationName: "addedBy",
  }),
}));

// ── Activity Log ────────────────────────────────────────────────────────────
export const activityLog = pgTable("activity_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  listId: uuid("list_id")
    .notNull()
    .references(() => lists.id),
  profileId: uuid("profile_id").references(() => profiles.id),
  action: text("action").notNull(),
  details: jsonb("details"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activityLogRelations = relations(activityLog, ({ one }) => ({
  list: one(lists, {
    fields: [activityLog.listId],
    references: [lists.id],
  }),
  profile: one(profiles, {
    fields: [activityLog.profileId],
    references: [profiles.id],
  }),
}));
