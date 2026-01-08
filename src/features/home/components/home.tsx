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

  // 未読メッセージの有無を確認
  const { data: memberRooms } = await supabase
    .from("room_members")
    .select("room_id, last_read_at")
    .eq("user_id", user.id);

  let hasUnread = false;
  if (memberRooms && memberRooms.length > 0) {
    for (const room of memberRooms) {
      const { count } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("room_id", room.room_id)
        .neq("sender_id", user.id)
        .gt("created_at", room.last_read_at || "1970-01-01")
        .limit(1);

      if (count && count > 0) {
        hasUnread = true;
        break;
      }
    }
  }

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
        {hasUnread ? (
          <section className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center space-x-3">
            <div className="bg-blue-500 p-2 rounded-full text-white">
              <Bell size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">新しいメッセージがあります</p>
              <p className="text-xs text-blue-700">未読のメッセージを確認してください</p>
            </div>
          </section>
        ) : null}
        
      </div>
    </MainLayout>
  );
}
