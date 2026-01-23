"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function startChat(otherUserId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // 1. 既存のダイレクトチャットルームがあるか確認
  // 2人だけのルームを探すロジック
  const { data: existingRooms, error: roomsError } = await supabase
    .from("room_members")
    .select("room_id")
    .eq("user_id", user.id);

  if (roomsError) throw roomsError;

  const roomIds = existingRooms.map(r => r.room_id);

  if (roomIds.length > 0) {
    const { data: commonRoom } = await supabase
      .from("room_members")
      .select("room_id")
      .in("room_id", roomIds)
      .eq("user_id", otherUserId)
      .maybeSingle();

    if (commonRoom) {
      return { roomId: commonRoom.room_id };
    }
  }

  // 2. 既存のルームがない場合は新規作成
  const { data: newRoom, error: roomCreateError } = await supabase
    .from("rooms")
    .insert({})
    .select()
    .single();

  if (roomCreateError) throw roomCreateError;

  // 3. メンバーを追加
  const { error: membersError } = await supabase
    .from("room_members")
    .insert([
      { room_id: newRoom.id, user_id: user.id },
      { room_id: newRoom.id, user_id: otherUserId }
    ]);

  if (membersError) throw membersError;

  return { roomId: newRoom.id };
}
