import { Grid } from "@/components/layout/grid";
import React from "react";

export default function PromptDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Grid className="grid-cols-1 md:[grid-template-columns:1fr_2fr] lg:[grid-template-columns:1fr_2fr_1fr]">
      {children}
    </Grid>
  );
}
