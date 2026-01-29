import { createClient } from "@/lib/supabase/server";

export async function getReviews(userId: string) {
  const supabase = await createClient();
  
  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("supporter_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }

  return reviews || [];
}
