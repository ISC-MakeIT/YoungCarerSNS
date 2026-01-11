import { createClient } from "@/lib/supabase/server";

export async function getProfile(userId: string) {
  const supabase = await createClient();
  return await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
}

export async function getMyProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  let roleSpecific = null;
  if (profile.role === 'carer') {
    const { data } = await supabase.from('carer_profiles').select('*').eq('user_id', user.id).single();
    roleSpecific = data;
  } else if (profile.role === 'supporter') {
    const { data } = await supabase.from('supporter_profiles').select('*').eq('user_id', user.id).single();
    roleSpecific = data;
  }

  return { ...profile, ...roleSpecific };
}
