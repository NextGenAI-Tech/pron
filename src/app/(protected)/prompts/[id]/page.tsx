import React from "react";
import { PromptBuilder } from "../../_components/prompt-builder";

export default async function PromptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <PromptBuilder />
    </>
  );
}
