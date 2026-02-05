import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import ChatClient from "./chat-client";
import { SetTitle } from "@/components/layout/set-title";
import { getRoomMembership, getOtherMemberProfile, getMessages, updateLastRead } from "../api/chat";
import { getProfile } from "@/features/profile/api/profile";

interface ChatRoomProps {
  roomId: string;
}

export default async function ChatRoom({ roomId }: ChatRoomProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 自分のプロフィール取得
  const profile = await getProfile(user.id);

  // ルームの存在確認とメンバーチェック
  const { data: memberInfo, error: memberError } = await getRoomMembership(roomId, user.id);

  if (memberError || !memberInfo) {
    notFound();
  }

  // 相手のプロフィール取得
  const { data: otherProfile } = await getOtherMemberProfile(roomId, user.id);
  const otherPartyLastActiveAt = (otherProfile as any)?.user_activity?.last_active_at || 
                                (Array.isArray((otherProfile as any)?.user_activity) ? (otherProfile as any).user_activity[0]?.last_active_at : null);

  // 初期メッセージの取得
  const { data: messages } = await getMessages(roomId);

  // 既読更新
  await updateLastRead(roomId, user.id);

  return (
    <>
      <SetTitle 
        title={otherProfile?.display_name || "チャット"} 
        userId={otherProfile?.id}
        lastActiveAt={otherPartyLastActiveAt}
      />
      <ChatClient 
        roomId={roomId}
        initialMessages={messages || []}
        currentUserId={user.id}
        currentUserRole={profile?.role || null}
        otherPartyId={otherProfile?.id || ""}
        otherPartyName={otherProfile?.display_name || "匿名ユーザー"}
        otherPartyRole={otherProfile?.role || null}
      />
    </>
  );
}
