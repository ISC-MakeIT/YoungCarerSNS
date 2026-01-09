import { createClient } from "@/lib/supabase/server";

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
  
  // まずメッセージを取得
  const { data: messages, error: messagesError } = await supabase
    .from("messages")
    .select("*")
    .eq("room_id", roomId)
    .order("created_at", { ascending: true });

  if (messagesError || !messages) {
    return { data: messages, error: messagesError };
  }

  // サポートタイプのメッセージがある場合、その情報を取得してマージ
  const supportIds = messages
    .filter(m => m.type === "support" && m.support_id)
    .map(m => m.support_id);

  if (supportIds.length > 0) {
    const { data: supports } = await supabase
      .from("supports")
      .select("id, request_body, start_at, end_at, request_note, status")
      .in("id", supportIds);

    if (supports) {
      const messagesWithSupports = messages.map(m => ({
        ...m,
        supports: m.support_id ? supports.find(s => s.id === m.support_id) : null
      }));
      return { data: messagesWithSupports, error: null };
    }
  }

  return { data: messages, error: null };
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
    .select("content, created_at, sender_id, type, support_id")
    .eq("room_id", roomId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !message) {
    return { data: message, error };
  }

  if (message.type === "support" && message.support_id) {
    const { data: support } = await supabase
      .from("supports")
      .select("request_body")
      .eq("id", message.support_id)
      .maybeSingle();
    
    return { 
      data: { ...message, supports: support }, 
      error: null 
    };
  }

  return { data: message, error: null };
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
  const { data: memberRooms } = await getMyChatRooms(userId);
  if (!memberRooms || memberRooms.length === 0) return false;

  for (const room of memberRooms) {
    const { count } = await getUnreadCount(room.room_id, userId, room.last_read_at);
    if (count && count > 0) return true;
  }
  return false;
}
