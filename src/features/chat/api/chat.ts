import { createClient } from "@/lib/supabase/server";
import { Message, Support } from "../types";

export async function getRoomMembership(roomId: string, userId: string) {
  const supabase = await createClient();
  return await supabase
    .from("room_members")
    .select("room_id")
    .eq("room_id", roomId)
    .eq("user_id", userId)
    .single();
}

export async function getOtherMemberProfile(roomId: string, userId: string) {
  const supabase = await createClient();
  const { data: otherMember } = await supabase
    .from("room_members")
    .select("user_id")
    .eq("room_id", roomId)
    .neq("user_id", userId)
    .single();

  if (!otherMember) return { data: null };

  return await supabase
    .from("profiles")
    .select("id, display_name, icon_url, role")
    .eq("id", otherMember.user_id)
    .single();
}

export async function getMessages(roomId: string) {
  const supabase = await createClient();
  
  const { data: messages, error } = await supabase
    .from("messages")
    .select(`
      *,
      supports (
        id, 
        request_body, 
        start_at, 
        end_at, 
        request_note, 
        status,
        carer_id,
        supporter_id,
        reviews(id)
      )
    `)
    .eq("room_id", roomId)
    .order("created_at", { ascending: true });

  if (error || !messages) {
    return { data: messages, error };
  }

  // Supabaseの結合クエリは常に配列を返すため、単一オブジェクトに変換
  const formattedMessages: Message[] = messages.map(m => ({
    ...m,
    supports: Array.isArray(m.supports) ? (m.supports[0] as unknown as Support) : (m.supports as unknown as Support)
  }));

  return { data: formattedMessages, error: null };
}

export async function updateLastRead(roomId: string, userId: string) {
  const supabase = await createClient();
  return await supabase
    .from("room_members")
    .update({ last_read_at: new Date().toISOString() })
    .eq("room_id", roomId)
    .eq("user_id", userId);
}

export async function getMyChatRooms(userId: string) {
  const supabase = await createClient();
  return await supabase
    .from("room_members")
    .select("room_id, last_read_at")
    .eq("user_id", userId);
}

export async function getLastMessage(roomId: string) {
  const supabase = await createClient();
  const { data: message, error } = await supabase
    .from("messages")
    .select(`
      id, 
      room_id, 
      content, 
      created_at, 
      sender_id, 
      type, 
      support_id, 
      image_url,
      supports (
        request_body
      )
    `)
    .eq("room_id", roomId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !message) {
    return { data: null, error };
  }

  // 配列で返ってくるsupportsを単一オブジェクトに整形してMessage型として返す
  const formattedMessage: Message = {
    ...message,
    supports: Array.isArray(message.supports) ? (message.supports[0] as unknown as Support) : (message.supports as unknown as Support)
  };

  return { data: formattedMessage, error: null };
}

export async function getUnreadCount(roomId: string, userId: string, lastReadAt: string | null) {
  const supabase = await createClient();
  return await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("room_id", roomId)
    .neq("sender_id", userId)
    .gt("created_at", lastReadAt || '1970-01-01');
}

export async function checkAnyUnreadMessages(userId: string) {
  const supabase = await createClient();
  const { data: memberRooms } = await supabase
    .from("room_members")
    .select("room_id, last_read_at")
    .eq("user_id", userId);

  if (!memberRooms || memberRooms.length === 0) return false;

  // 各ルームの未読条件をORで結合して1つのクエリで確認する
  const filters = memberRooms.map((room) => 
    `and(room_id.eq.${room.room_id},sender_id.neq.${userId},created_at.gt.${room.last_read_at || "1970-01-01"})`
  ).join(",");

  const { count } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .or(filters);

  return !!(count && count > 0);
}
