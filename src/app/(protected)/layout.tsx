import React from "react";
import { AppHeader } from "./_components/app-header";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <AppHeader />
      {children}
    </div>
  );
}
