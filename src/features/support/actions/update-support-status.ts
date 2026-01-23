"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface UpdateSupportStatusParams {
  supportId: string;
  status: "accepted" | "rejected" | "ongoing" | "cancelled" | "completed";
  roomId: string;
}

export async function updateSupportStatus({
  supportId,
  status,
  roomId,
}: UpdateSupportStatusParams) {
  const supabase = await createClient();

  const updateData: any = { status };

  if (status === "ongoing") {
    updateData.started_at = new Date().toISOString();
  }
  
  if (status === "completed") {
    updateData.completed_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("supports")
    .update(updateData)
    .eq("id", supportId);

  if (error) {
    console.error("Error updating support status:", error);
    throw new Error("ステータスの更新に失敗しました");
  }

  revalidatePath(`/chat/${roomId}`);
  return { success: true };
}
