"use server";

import { createClient } from "@/lib/supabase/server";
import { getMatchingProfiles } from "../api/matching";

export async function getPseudoMatchingProfiles(topics: string[]) {
  const supabase = await createClient();
  
  // NOTE: getMatchingProfiles internally calls createClient() again.
  // But getMatchingProfiles requires a userId to exclude 'self' from matching.
  // Since this is public, we can pass a dummy UUID or modify getMatchingProfiles.
  // For now, let's pass an empty string or null if possible. 
  
  // Looking at matching.ts: .neq("id", userId)
  // If userId is empty string, it should be fine.
  
  const { data, error } = await supabase
    .from("profiles")
    .select("*, carer_profiles(*), user_activity(last_active_at)")
    .eq("role", "supporter")
    .overlaps("help_topics", topics)
    .limit(3);

  if (error) {
    console.error("Error fetching pseudo matching profiles:", error);
    return [];
  }

  return data;
}
