import { cn } from "@/lib/utils";
import React from "react";

type VStackProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "header" | "footer" | "main";
} & React.ComponentProps<"div">;

export function VStack({
  children,
  className,
  as = "div",
  ...props
}: VStackProps) {
  const Comp = as;
  return (
    <Comp className={cn("flex flex-col gap-4", className)} {...props}>
      {children}
    </Comp>
  );
}
