import React from "react";
import { headers } from "next/headers";
import { PromptsLists } from "./_components/prompts-lists";
import type { FullPrompt, Category } from "@/types/pron-types";

type ApiCategory = Omit<Category, "createdAt"> & { createdAt: string | null };
type ApiFullPrompt = Omit<
  FullPrompt,
  "created_at" | "updated_at" | "categories"
> & {
  created_at: string | null;
  updated_at: string | null;
  categories: ApiCategory[];
};

async function getOriginAndCookie() {
  const hdrs = await headers();
  const proto = hdrs.get("x-forwarded-proto") ?? "http";
  const host = hdrs.get("host") ?? "localhost:3000";
  const cookie = hdrs.get("cookie") ?? "";
  return {
    origin: `${proto}://${host}`,
    cookie,
  } as const;
}

async function fetchPrompts(): Promise<FullPrompt[]> {
  const { origin, cookie } = await getOriginAndCookie();
  const res = await fetch(`${origin}/api/prompts`, {
    cache: "no-store",
    next: { revalidate: 0 },
    headers: { cookie },
  });
  if (!res.ok) throw new Error("failed to load prompts");
  const data: ApiFullPrompt[] = await res.json();
  return data.map(
    (p): FullPrompt => ({
      ...p,
      created_at: p.created_at ? new Date(p.created_at) : null,
      updated_at: p.updated_at ? new Date(p.updated_at) : null,
      categories: (p.categories ?? []).map(
        (c): Category => ({
          ...c,
          createdAt: c.createdAt ? new Date(c.createdAt) : null,
        }),
      ),
    }),
  );
}

async function fetchCategories(): Promise<Category[]> {
  const { origin, cookie } = await getOriginAndCookie();
  const res = await fetch(`${origin}/api/categories`, {
    cache: "no-store",
    next: { revalidate: 0 },
    headers: { cookie },
  });
  if (!res.ok) throw new Error("failed to load categories");
  const data: ApiCategory[] = await res.json();
  return data.map(
    (c): Category => ({
      ...c,
      createdAt: c.createdAt ? new Date(c.createdAt) : null,
    }),
  );
}

export default async function PromptsPage() {
  const [prompts, categories] = await Promise.all([
    fetchPrompts(),
    fetchCategories(),
  ]);

  return (
    <main className="px-10 py-20">
      <PromptsLists initialPrompts={prompts} categories={categories} />
    </main>
  );
}
