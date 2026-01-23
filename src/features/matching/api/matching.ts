import { createClient } from "@/lib/supabase/server";

export async function getMatchingProfiles(userId: string, limit = 10) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*, carer_profiles(*)")
    .neq("id", userId)
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return data.map((profile) => {
    const { carer_profiles, ...baseProfile } = profile;

    if (profile.role !== "carer") return baseProfile;

    const carerProfile = carer_profiles as any;
    if (!carerProfile) return baseProfile;

    const maskedProfile = { 
      ...baseProfile,
      family_situation: carerProfile.family_situation
    };

    // 居住地の非表示設定
    if (carerProfile.location_visibility === "prefecture_only") {
      maskedProfile.city = null;
    } else if (carerProfile.location_visibility === "private") {
      maskedProfile.prefecture = "非公開";
      maskedProfile.city = null;
    }

    // 相談したいことの非表示設定
    if (carerProfile.help_topic_visibility === "private") {
      maskedProfile.help_topics = ["非公開"];
      maskedProfile.help_topic_other = null;
    }

    // チャットのスタンスの非表示設定
    if (carerProfile.chat_stance_visibility === "private") {
      maskedProfile.chat_stances = ["非公開"];
    }

    // 家族状況の非表示設定
    if (carerProfile.family_situation_visibility === "private") {
      (maskedProfile as any).family_situation = "非公開";
    }

    return maskedProfile;
  });
}
