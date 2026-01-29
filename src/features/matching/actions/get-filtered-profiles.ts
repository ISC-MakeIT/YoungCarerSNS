"use server";

import { createClient } from "@/lib/supabase/server";
import { getMatchingProfiles } from "../api/matching";

export async function getFilteredProfiles(options: { 
  topics?: string[]; 
  stances?: string[]; 
  q?: string; 
  role?: "carer" | "supporter" | "all";
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return await getMatchingProfiles(user.id, {
    topics: options.topics,
    stances: options.stances,
    query: options.q,
    role: options.role,
    limit: 10
  });
}
