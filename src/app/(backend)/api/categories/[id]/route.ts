import { NextRequest, NextResponse } from "next/server";
import { getCategoryById } from "@/data/categories-model";

export const GET = async (
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) => {
  try {
    const { id: idStr } = await context.params;
    const id = Number(idStr);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    const category = await getCategoryById()(id);
    if (!category)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(category);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 },
    );
  }
};
