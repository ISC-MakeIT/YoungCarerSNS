import { Bell, PenLine, ChevronRight } from "lucide-react";
import { getUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { checkAnyUnreadMessages } from "@/features/chat/api/chat";
import { getProfile } from "@/features/profile/api/profile";

export default async function Home() {
  const { data: { user } } = await getUser();

  if (!user) {
    redirect("/login");
  }

  // 並列でデータを取得する
  const [profile, hasUnread] = await Promise.all([
    getProfile(user.id),
    checkAnyUnreadMessages(user.id)
  ]);

  return (
    <div className="p-4 space-y-6">
      {/* ユーザー挨拶 */}
      <div className="px-1">
        <h2 className="text-xl font-bold text-gray-900">
          こんにちは、{profile?.display_name || "ゲスト"} さん
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {profile?.role === "supporter" ? "サポーター" : "一般"}としてログイン中
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

      {/* 振り返りカード */}
      <Link href="/reflection" className="block">
        <section className="bg-white border border-gray-100 rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:border-orange-200 transition-all flex items-center justify-between group">
          <div className="flex items-center space-x-4">
            <div className="bg-orange-50 p-3 rounded-2xl text-orange-500 group-hover:bg-orange-100 transition-colors">
              <PenLine size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-[17px] font-bold text-gray-900">今の気持ちを記録する</h3>
              <p className="text-sm text-gray-500 mt-0.5">
                今の状況を振り返ってみませんか？
              </p>
            </div>
          </div>
          <ChevronRight className="text-gray-300 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" size={20} />
        </section>
      </Link>
      
    </div>
  );
}
