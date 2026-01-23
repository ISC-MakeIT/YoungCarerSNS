"use server";

import { createClient } from "@/lib/supabase/server";

export async function sendMessage(roomId: string, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("messages")
    .insert({
      room_id: roomId,
      sender_id: user.id,
      content: content,
      type: "text"
    });

  if (error) {
    console.error("Error sending message:", error);
    throw new Error("Failed to send message");
  }
}
