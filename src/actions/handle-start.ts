"use server";

import { requireUser } from "@/data/require-user";
import { redirect } from "next/navigation";

export async function handleStart() {
  const user = await requireUser();
  if (!user) {
    redirect("/sign-in");
  }
  redirect("/prompts");
}
