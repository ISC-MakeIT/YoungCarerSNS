import { Bell, ExternalLink, MessageSquarePlus } from "lucide-react";
import MainLayout from "@/components/main/main-layout";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // 未読メッセージの簡易取得
  const { count: unreadCount } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .neq("sender_id", user.id);

  return (
    <MainLayout title="ホーム">
      <div className="p-4 space-y-6">
        {/* ユーザー挨拶 */}
        <div className="px-1">
          <h2 className="text-xl font-bold text-gray-900">
            こんにちは、{profile?.display_name || "ゲスト"} さん
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {profile?.role === "carer" ? "ヤングケアラー" : "サポーター"}としてログイン中
          </p>
        </div>

        {/* 新着チャット通知 */}
        {unreadCount ? (
          <section className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center space-x-3">
            <div className="bg-blue-500 p-2 rounded-full text-white">
              <Bell size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">新しいメッセージがあります</p>
              <p className="text-xs text-blue-700">{unreadCount}件の未読メッセージ</p>
            </div>
          </section>
        ) : null}
        
      </div>
    </MainLayout>
  );
}
