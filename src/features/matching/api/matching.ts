import { createClient } from "@/lib/supabase/server";

export async function getMatchingProfiles(userId: string, limit = 10) {
  const supabase = await createClient();
  return await supabase
    .from("profiles")
    .select("*")
    .neq("id", userId)
    .limit(limit);
}
