import { ReactNode } from "react";
import AuthLayoutClient from "@/components/layout/auth-layout-client";
import { TitleProvider } from "@/components/layout/title-context";
import { createClient } from "@/lib/supabase/server";

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <TitleProvider>
      <AuthLayoutClient userId={user?.id}>
        {children}
      </AuthLayoutClient>
    </TitleProvider>
  );
}
