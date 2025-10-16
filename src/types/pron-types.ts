// db/types.ts
import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import {
  users,
  aiProviders,
  categories,
  prompts,
  promptVariables,
  promptCategories,
} from "@/db/schema";

// 기본 테이블 타입들
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type AIProvider = InferSelectModel<typeof aiProviders>;
export type NewAIProvider = InferInsertModel<typeof aiProviders>;

export type Category = InferSelectModel<typeof categories>;
export type NewCategory = InferInsertModel<typeof categories>;

export type Prompt = InferSelectModel<typeof prompts>;
export type NewPrompt = InferInsertModel<typeof prompts>;

export type PromptVariable = InferSelectModel<typeof promptVariables>;
export type NewPromptVariable = InferInsertModel<typeof promptVariables>;

export type PromptCategory = InferSelectModel<typeof promptCategories>;
export type NewPromptCategory = InferInsertModel<typeof promptCategories>;

// Prompt의 확장형 타입 (카테고리 + 변수 포함)
export type FullPrompt = Prompt & {
  variables: PromptVariable[];
  categories: Category[];
};
