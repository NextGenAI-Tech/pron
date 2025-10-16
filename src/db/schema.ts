import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  serial,
  integer,
  boolean,
  primaryKey,
} from "drizzle-orm/pg-core";

// for webhook creation
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  clerkId: text("clerk_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const aiProviders = pgTable("ai_providers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const prompts = pgTable("prompts", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  template: text("template").notNull(),
  examplePrompt: text("example_prompt"),
  // users.id 는 text 타입이므로 참조 컬럼도 text 로 맞춘다
  created_by: text("created_by").references(() => users.id),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  recommended_ai: integer("recommended_ai").references(() => aiProviders.id),
});

export const promptVariables = pgTable("prompt_variables", {
  id: uuid("id").defaultRandom().primaryKey(),
  prompt_id: uuid("prompt_id")
    .notNull()
    .references(() => prompts.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 64 }).notNull(),
  required: boolean("required").notNull().default(true),
  order: integer("order").notNull().default(0),
});

export const promptCategories = pgTable(
  "prompt_categories",
  {
    // prompts.id 는 uuid 타입이므로 참조 컬럼도 uuid 로 맞춘다
    promptId: uuid("prompt_id")
      .notNull()
      .references(() => prompts.id, { onDelete: "cascade" }),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.promptId, t.categoryId] }),
  }),
);

export const promptRelations = relations(prompts, ({ many }) => ({
  variables: many(promptVariables),
  // prompts -> prompt_categories
  promptCategories: many(promptCategories),
}));

export const promptVariableRelations = relations(
  promptVariables,
  ({ one }) => ({
    prompt: one(prompts, {
      fields: [promptVariables.prompt_id],
      references: [prompts.id],
    }),
  }),
);

export const promptCategoryRelations = relations(
  promptCategories,
  ({ one }) => ({
    prompt: one(prompts, {
      fields: [promptCategories.promptId],
      references: [prompts.id],
    }),
    category: one(categories, {
      fields: [promptCategories.categoryId],
      references: [categories.id],
    }),
  }),
);
