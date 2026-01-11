"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface CreateSupportParams {
  roomId: string;
  carerId: string;
  supporterId: string;
  content: string;
  startTime: string;
  endTime: string;
  note: string;
}

export async function createSupport({
  roomId,
  carerId,
  supporterId,
  content,
  startTime,
  endTime,
  note,
}: CreateSupportParams) {
  const supabase = await createClient();

  // 1. supportsテーブルにレコード作成
  const { data: support, error: supportError } = await supabase
    .from("supports")
    .insert({
      room_id: roomId,
      carer_id: carerId,
      supporter_id: supporterId,
      status: "pending",
      request_body: content,
      request_note: note,
      start_at: startTime,
      end_at: endTime,
    })
    .select()
    .single();

  if (supportError) {
    console.error("Error creating support:", supportError);
    throw new Error("依頼の作成に失敗しました");
  }

  // 2. messagesテーブルにサポートタイプのメッセージを作成
  const { error: messageError } = await supabase.from("messages").insert({
    room_id: roomId,
    sender_id: carerId,
    type: "support",
    content: "サポート依頼を送信しました",
    support_id: support.id,
  });

  if (messageError) {
    console.error("Error creating support message:", messageError);
    // メッセージ作成に失敗してもサポートレコード自体は作成されているが、
    // チャットに表示されないためエラーとする（本当はロールバックしたいがSupabase JSでは難しい）
    throw new Error("依頼メッセージの送信に失敗しました");
  }

  revalidatePath(`/chat/${roomId}`);
  return { success: true };
}
