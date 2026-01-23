"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface SendReviewParams {
  supportId: string;
  supporterId: string;
  reviewerId: string;
  comment: string;
  roomId: string;
}

export async function sendReview({
  supportId,
  supporterId,
  reviewerId,
  comment,
  roomId,
}: SendReviewParams) {
  const supabase = await createClient();

  const { error } = await supabase.from("reviews").insert({
    support_id: supportId,
    supporter_id: supporterId,
    reviewer_id: reviewerId,
    comment: comment,
  });

  if (error) {
    console.error("Error sending review:", error);
    throw new Error("レビューの送信に失敗しました");
  }

  revalidatePath(`/chat/${roomId}`);
  return { success: true };
}
