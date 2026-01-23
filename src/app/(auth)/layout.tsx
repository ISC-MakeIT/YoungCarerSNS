import { ReactNode } from "react";
import AuthLayoutClient from "@/components/layout/auth-layout-client";
import { TitleProvider } from "@/components/layout/title-context";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <TitleProvider>
      <AuthLayoutClient>
        {children}
      </AuthLayoutClient>
    </TitleProvider>
  );
}
