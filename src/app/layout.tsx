import type { Metadata } from "next";
import "./globals.css";

import { ThemeProvider } from "@/services/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/themes";

export const metadata: Metadata = {
  title: "Pron - Prompt Library for NGA",
  description: "Powered by NextGenAI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={shadcn}>
      <html lang="ko" suppressHydrationWarning>
        <body className={`bg-background antialiased`}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
