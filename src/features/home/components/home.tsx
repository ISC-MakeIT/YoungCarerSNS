import { Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { checkAnyUnreadMessages } from "@/features/chat/api/chat";
import { getProfile } from "@/features/profile/api/profile";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await getProfile(user.id);

  // 未読メッセージの有無を確認
  const hasUnread = await checkAnyUnreadMessages(user.id);

  return (
    <div className="p-4 space-y-6">
      {/* ユーザー挨拶 */}
      <div className="px-1">
        <h2 className="text-xl font-bold text-gray-900">
          こんにちは、{profile?.display_name || "ゲスト"} さん
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {profile?.role === "carer" ? "一般" : "サポーター"}としてログイン中
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
  );
}
