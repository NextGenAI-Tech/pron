import { GridItem } from "@/components/layout/grid";

type PromptBuilderProps = {};

export function PromptBuilder({}: PromptBuilderProps) {
  return (
    <>
      <GridItem className="lg:col-span-1">Prompt Builder</GridItem>
      <GridItem className="md:col-span-2 lg:col-span-2">
        Prompt Builder
      </GridItem>
      <GridItem className="lg:col-span-1">Prompt Builder</GridItem>
    </>
  );
}
