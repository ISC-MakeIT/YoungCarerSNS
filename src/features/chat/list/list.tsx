import { Search } from "lucide-react";
import { Avatar } from "@/components/main/avatar";
import MainLayout from "@/components/main/main-layout";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ChatList() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 自分が参加しているルームを取得
  const { data: myRooms } = await supabase
    .from("room_members")
    .select("room_id, last_read_at")
    .eq("user_id", user.id);

  const roomIds = myRooms?.map(r => r.room_id) || [];

  // 各ルームの最新メッセージと相手のプロフィールを取得
  // 本来はもっと効率的なクエリが必要だが、ここでは分かりやすさ優先で実装
  const chatListData = await Promise.all(roomIds.map(async (roomId) => {
    // 相手のメンバー情報を取得
    const { data: otherMember } = await supabase
      .from("room_members")
      .select("user_id")
      .eq("room_id", roomId)
      .neq("user_id", user.id)
      .single();

    // 相手のプロフィールを取得
    const { data: profile } = otherMember ? await supabase
      .from("profiles")
      .select("display_name, icon_url")
      .eq("id", otherMember.user_id)
      .single() : { data: null };

    // 最新メッセージを取得
    const { data: lastMessage } = await supabase
      .from("messages")
      .select("content, created_at")
      .eq("room_id", roomId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    // 未読数をカウント（簡易版：自分の last_read_at より後のメッセージ数）
    const myMemberInfo = myRooms?.find(r => r.room_id === roomId);
    const { count: unreadCount } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("room_id", roomId)
      .neq("sender_id", user.id)
      .gt("created_at", myMemberInfo?.last_read_at || '1970-01-01');

    return {
      id: roomId,
      name: profile?.display_name || "匿名ユーザー",
      lastMessage: lastMessage?.content || "メッセージはありません",
      time: lastMessage ? new Date(lastMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
      unread: unreadCount || 0,
    };
  }));

  return (
    <MainLayout title="チャット">
      <div className="flex flex-col h-full">
        {/* 検索バー */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="名前やメッセージを検索"
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* DMリスト */}
        <div className="flex-1 overflow-y-auto">
          {chatListData.length > 0 ? (
            chatListData.map((chat) => (
              <Link
                key={chat.id}
                href={`/chat/${chat.id}`}
                className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 active:bg-gray-100 transition-colors"
              >
                <div className="relative">
                  <Avatar className="w-12 h-12" />
                  {chat.unread > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                      {chat.unread}
                    </span>
                  )}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-bold text-gray-900 truncate">{chat.name}</h3>
                    <span className="text-[10px] text-gray-400">{chat.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{chat.lastMessage}</p>
                </div>
              </Link>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500 text-sm">
              チャットがまだありません
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
