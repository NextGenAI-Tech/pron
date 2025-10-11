"use server";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function requireUser() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  return user;
}
