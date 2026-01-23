import { createClient } from "@/lib/supabase/server";

export async function getProfile(userId: string) {
  const supabase = await createClient();
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  const isOwner = currentUser?.id === userId;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*, carer_profiles(*), supporter_profiles(*)")
    .eq("id", userId)
    .single();

  if (error || !profile) return null;

  const { carer_profiles, supporter_profiles, ...baseProfile } = profile;

  if (profile.role === 'supporter') {
    return { ...baseProfile, ...(supporter_profiles as any) };
  }

  if (profile.role === 'carer') {
    const carerProfile = carer_profiles as any;
    if (!carerProfile) return baseProfile;

    const result = { ...baseProfile, ...carerProfile };

    // 他人のプロフィールの場合は公開設定を適用
    if (!isOwner) {
      // 居住地の非表示設定
      if (carerProfile.location_visibility === "prefecture_only") {
        result.city = null;
      } else if (carerProfile.location_visibility === "private") {
        result.prefecture = "非公開";
        result.city = null;
      }

      // 相談したいことの非表示設定
      if (carerProfile.help_topic_visibility === "private") {
        result.help_topics = ["非公開"];
        result.help_topic_other = null;
      }

      // チャットのスタンスの非表示設定
      if (carerProfile.chat_stance_visibility === "private") {
        result.chat_stances = ["非公開"];
      }

      // 家族状況の非表示設定
      if (carerProfile.family_situation_visibility === "private") {
        result.family_situation = "非公開";
      }
    }

    return result;
  }

  return baseProfile;
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
