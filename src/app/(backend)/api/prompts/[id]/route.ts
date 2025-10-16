import { NextRequest, NextResponse } from "next/server";
import {
  getPromptById,
  deletePrompt,
  updatePrompt,
} from "@/data/prompts-model";

export const GET = async (
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await context.params;
    const prompt = await getPromptById()(id);
    if (!prompt)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(prompt);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch prompt" },
      { status: 500 },
    );
  }
};

export const DELETE = async (
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await context.params;
    await deletePrompt()(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to delete prompt" },
      { status: 500 },
    );
  }
};

export const PATCH = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) => {
  try {
    const body = await req.json();
    const { title, description, template, variables, categoryIds } = body ?? {};
    const { id } = await context.params;
    const updated = await updatePrompt()(
      id,
      { title, description, template },
      variables,
      categoryIds,
    );
    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update prompt" },
      { status: 500 },
    );
  }
};
