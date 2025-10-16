// db/categoryService.ts
import { db } from "@/db";
import { categories, promptCategories } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { NewCategory } from "@/types/pron-types";

// 🟩 CREATE
export const createCategory =
  (dbInstance = db) =>
  async (data: NewCategory) => {
    const [cat] = await dbInstance.insert(categories).values(data).returning();
    return cat;
  };

// 🟨 READ
export const getCategoryById =
  (dbInstance = db) =>
  async (id: number) =>
    dbInstance.query.categories.findFirst({
      where: eq(categories.id, id),
      with: {
        prompts: {
          with: {
            prompt: true,
          },
        },
      },
    });

// 🟦 UPDATE
export const updateCategory =
  (dbInstance = db) =>
  async (id: number, data: Partial<NewCategory>) => {
    const [updated] = await dbInstance
      .update(categories)
      .set(data)
      .where(eq(categories.id, id))
      .returning();
    return updated;
  };

// 🟥 DELETE
export const deleteCategory =
  (dbInstance = db) =>
  async (id: number) => {
    await dbInstance
      .delete(promptCategories)
      .where(eq(promptCategories.categoryId, id));
    await dbInstance.delete(categories).where(eq(categories.id, id));
  };

// 🟪 LIST
export const listCategories =
  (dbInstance = db) =>
  async () =>
    dbInstance.select().from(categories);
