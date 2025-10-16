// db/promptService.ts
import { db } from "@/db";
import { prompts, promptVariables, promptCategories } from "@/db/schema";
import { eq } from "drizzle-orm";
import type {
  NewPrompt,
  NewPromptVariable,
  FullPrompt,
} from "@/types/pron-types";

// 받아오는 변수는 prompt_id 없이도 허용되도록 타입 완화
type CreateVariableInput = Omit<NewPromptVariable, "prompt_id">;

// 🟩 CREATE Prompt
export const createPrompt =
  (dbInstance = db) =>
  async (
    promptData: NewPrompt,
    variables: CreateVariableInput[] = [],
    categoryIds: number[] = [],
  ): Promise<FullPrompt> => {
    const [prompt] = await dbInstance
      .insert(prompts)
      .values(promptData)
      .returning();

    if (variables.length > 0) {
      await dbInstance
        .insert(promptVariables)
        .values(variables.map((v) => ({ ...v, prompt_id: prompt.id })));
    }

    if (categoryIds.length > 0) {
      await dbInstance.insert(promptCategories).values(
        categoryIds.map((id) => ({
          promptId: prompt.id,
          categoryId: id,
        })),
      );
    }

    const full = await getPromptById(dbInstance)(prompt.id);
    if (!full) throw new Error("Failed to load created prompt");
    return full;
  };

// 🟨 READ Prompt (전체 정보)
export const getPromptById =
  (dbInstance = db) =>
  async (id: string): Promise<FullPrompt | null> => {
    const prompt = await dbInstance.query.prompts.findFirst({
      where: eq(prompts.id, id),
      with: {
        variables: true,
        promptCategories: {
          with: { category: true },
        },
      },
    });

    if (!prompt) return null;

    const { promptCategories: promptCategoriesRows, ...base } = prompt;
    return {
      ...base,
      categories: promptCategoriesRows.map((pc) => pc.category),
    };
  };

// 🟦 UPDATE Prompt (+ variables, categories)
export const updatePrompt =
  (dbInstance = db) =>
  async (
    id: string,
    data: Partial<NewPrompt>,
    variables?: CreateVariableInput[],
    categoryIds?: number[],
  ): Promise<FullPrompt> => {
    await dbInstance
      .update(prompts)
      .set({ ...data, updated_at: new Date() })
      .where(eq(prompts.id, id))
      .returning();

    if (variables) {
      await dbInstance
        .delete(promptVariables)
        .where(eq(promptVariables.prompt_id, id));
      await dbInstance
        .insert(promptVariables)
        .values(variables.map((v) => ({ ...v, prompt_id: id })));
    }

    if (categoryIds) {
      await dbInstance
        .delete(promptCategories)
        .where(eq(promptCategories.promptId, id));
      await dbInstance.insert(promptCategories).values(
        categoryIds.map((catId) => ({
          promptId: id,
          categoryId: catId,
        })),
      );
    }

    const full = await getPromptById(dbInstance)(id);
    if (!full) throw new Error("Prompt not found after update");
    return full;
  };

// 🟥 DELETE Prompt
export const deletePrompt =
  (dbInstance = db) =>
  async (id: string) => {
    await dbInstance
      .delete(promptVariables)
      .where(eq(promptVariables.prompt_id, id));
    await dbInstance
      .delete(promptCategories)
      .where(eq(promptCategories.promptId, id));
    await dbInstance.delete(prompts).where(eq(prompts.id, id));
  };

// 🟪 LIST Prompts (간단 조회)
export const listPrompts =
  (dbInstance = db) =>
  async (): Promise<FullPrompt[]> => {
    const rows = await dbInstance.query.prompts.findMany({
      with: {
        variables: true,
        promptCategories: {
          with: { category: true },
        },
      },
      orderBy: (p, { desc }) => [desc(p.created_at)],
    });

    return rows.map(({ promptCategories: pcs, ...base }) => ({
      ...base,
      categories: pcs.map((pc) => pc.category),
    }));
  };
