import { NextResponse } from "next/server";
import { listCategories } from "@/data/categories-model";

export const GET = async () => {
  try {
    const categories = await listCategories()();
    return NextResponse.json(categories);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
};
