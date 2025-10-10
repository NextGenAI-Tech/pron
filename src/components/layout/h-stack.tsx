import { cn } from "@/lib/utils";
import React from "react";

type HStackProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "header" | "footer" | "main";
} & React.ComponentProps<"div">;

export function HStack({
  children,
  className,
  as = "div",
  ...props
}: HStackProps) {
  const Comp = as;
  return (
    <Comp className={cn("flex flex-row gap-4", className)} {...props}>
      {children}
    </Comp>
  );
}
