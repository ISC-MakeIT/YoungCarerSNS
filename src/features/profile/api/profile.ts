import { createClient } from "@/lib/supabase/server";

export async function getProfile(userId: string) {
  const supabase = await createClient();
  return await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
}
