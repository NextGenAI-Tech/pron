// app/api/prompts/route.ts
import { NextResponse } from "next/server";
import { createPrompt, listPrompts } from "@/data/prompts-model";
import { extractVariables } from "@/lib/prompt-templates";

export const GET = async () => {
  try {
    const prompts = await listPrompts()();
    return NextResponse.json(prompts);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch prompts" },
      { status: 500 },
    );
  }
};

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { title, description, template, categoryIds = [] } = body;

    // 템플릿에서 변수 자동 추출
    const variables = extractVariables(template);

    const newPrompt = await createPrompt()(
      { title, description, template },
      variables,
      categoryIds,
    );

    return NextResponse.json(newPrompt, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create prompt" },
      { status: 500 },
    );
  }
};
