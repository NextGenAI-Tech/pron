import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";
import { Gabarito, Noto_Sans_KR } from "next/font/google"; // TODO: add your font

// TODO: add your theme according to design system
const textVariants = cva("text-base", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
});

type TextProps = {
  children: React.ReactNode;
  className?: string;
  lang?: "ko" | "en";
  as?: "p" | "span" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
} & VariantProps<typeof textVariants> &
  React.ComponentProps<"p">;

const gabarito = Gabarito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export function Text({
  children,
  className,
  as = "p",
  size = "base",
  weight = "normal",
  lang = "en",
  ...props
}: TextProps) {
  const Comp = as;
  const fontByLang = {
    ko: notoSansKR.className,
    en: gabarito.className,
  };
  const fontClass = fontByLang[lang];

  return (
    <Comp
      className={cn(textVariants({ size, weight }), className, fontClass)}
      {...props}
    >
      {children}
    </Comp>
  );
}
