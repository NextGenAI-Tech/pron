import { cn } from "@/lib/utils";

type GridProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "header" | "footer" | "main";
} & React.ComponentProps<"div">;

function Grid({ children, className, as = "div", ...props }: GridProps) {
  const Comp = as;
  return (
    <Comp className={cn("grid", className)} {...props}>
      {children}
    </Comp>
  );
}

type GridItemProps = {
  children: React.ReactNode;
  className?: string;
} & React.ComponentProps<"div">;

function GridItem({ children, className, ...props }: GridItemProps) {
  return (
    <div className={cn("grid-item", className)} {...props}>
      {children}
    </div>
  );
}

export { Grid, GridItem };
