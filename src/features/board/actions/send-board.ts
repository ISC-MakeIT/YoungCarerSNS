"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function sendBoard(content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  if (!content || content.trim().length === 0) {
    throw new Error("Content is required");
  }

  const { error } = await supabase
    .from("board")
    .insert({
      user_id: user.id,
      content: content.trim(),
    });

  if (error) {
    console.error("Error sending board message:", error);
    throw new Error("Failed to send message");
  }

  revalidatePath("/board");
}
