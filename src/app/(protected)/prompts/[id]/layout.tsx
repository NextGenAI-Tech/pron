import { Grid } from "@/components/layout/grid";
import React from "react";

export default function PromptDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Grid className="grid-cols-1 gap-4 px-10 py-20 md:[grid-template-columns:4fr_1fr] lg:[grid-template-columns:4fr_1fr]">
      {children}
    </Grid>
  );
}
