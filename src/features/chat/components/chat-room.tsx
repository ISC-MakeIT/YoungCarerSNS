import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import ChatClient from "./chat-client";
import MainLayout from "@/components/main/main-layout";

interface ChatRoomProps {
  roomId: string;
}

export default async function ChatRoom({ roomId }: ChatRoomProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // ルームの存在確認とメンバーチェック
  const { data: memberInfo, error: memberError } = await supabase
    .from("room_members")
    .select("room_id")
    .eq("room_id", roomId)
    .eq("user_id", user.id)
    .single();

  if (memberError || !memberInfo) {
    notFound();
  }

  // 相手のプロフィール取得
  const { data: otherMember } = await supabase
    .from("room_members")
    .select("user_id")
    .eq("room_id", roomId)
    .neq("user_id", user.id)
    .single();

  const { data: otherProfile } = otherMember ? await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", otherMember.user_id)
    .single() : { data: null };

  // 初期メッセージの取得
  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("room_id", roomId)
    .order("created_at", { ascending: true });

  // 既読更新
  await supabase
    .from("room_members")
    .update({ last_read_at: new Date().toISOString() })
    .eq("room_id", roomId)
    .eq("user_id", user.id);

  return (
    <MainLayout title={otherProfile?.display_name || "チャット"}>
      <ChatClient 
        roomId={roomId}
        initialMessages={messages || []}
        currentUserId={user.id}
        otherPartyName={otherProfile?.display_name || "匿名ユーザー"}
      />
    </MainLayout>
  );
}
