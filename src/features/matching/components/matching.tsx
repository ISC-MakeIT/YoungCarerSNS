import MainLayout from "@/components/main/main-layout";
import { createClient } from "@/lib/supabase/server";
import MatchingClient from "./matching-client";

export default async function Matching() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // 自分のプロフィールを取得して、自分以外のユーザーを表示する
  const { data: myProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // 自分とは異なるロールのユーザーを優先的に表示（簡易的なマッチングロジック）
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .neq("id", user.id)
    .limit(10);

  return (
    <MainLayout title="マッチング">
      <MatchingClient profiles={profiles || []} />
    </MainLayout>
  );
}
