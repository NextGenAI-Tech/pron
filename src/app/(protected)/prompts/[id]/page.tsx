import React, { Fragment } from "react";
import { PromptBuilder } from "../../_components/prompt-builder";
import { getPromptById } from "@/data/prompts-model";
import { notFound } from "next/navigation";

export default async function PromptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const prompt = await getPromptById()(id);

  if (!prompt) {
    notFound();
  }

  return (
    <Fragment>
      <PromptBuilder prompt={prompt} />
    </Fragment>
  );
}
