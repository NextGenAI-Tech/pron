import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

// TODO: add your theme according to design system
const containerVariants = cva("container mx-auto", {
  variants: {
    size: {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
      "3xl": "max-w-3xl",
      "4xl": "max-w-4xl",
      "5xl": "max-w-5xl",
    },
  },
});

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
} & VariantProps<typeof containerVariants> &
  React.ComponentProps<"div">;

export function Container({
  children,
  className,
  size = "md",
  ...props
}: ContainerProps) {
  return (
    <div className={cn(containerVariants({ size, className }))} {...props}>
      {children}
    </div>
  );
}
