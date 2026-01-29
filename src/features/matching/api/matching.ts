import { createClient } from "@/lib/supabase/server";

export async function getMatchingProfiles(
  userId: string, 
  options: { 
    limit?: number; 
    topics?: string[]; 
    stances?: string[]; 
    query?: string; 
    role?: "carer" | "supporter" | "all";
  } = {}
) {
  const { limit = 10, topics, stances, query, role } = options;
  const supabase = await createClient();
  
  let q = supabase
    .from("profiles")
    .select("*, carer_profiles(*)")
    .neq("id", userId);

  if (role && role !== "all") {
    q = q.eq("role", role);
  }

  if (topics && topics.length > 0) {
    q = q.overlaps("help_topics", topics);
  }

  if (stances && stances.length > 0) {
    q = q.overlaps("chat_stances", stances);
  }

  if (query) {
    q = q.or(`display_name.ilike.%${query}%,bio.ilike.%${query}%,help_topic_other.ilike.%${query}%`);
  }

  // タグ一致件数でソートするために全件（または多めに）取得
  const { data, error } = await q.limit(100);

  if (error || !data) {
    return [];
  }

  // 非公開設定の考慮と有効なマッチングの抽出
  const validProfiles = data.filter((profile) => {
    if (profile.role !== "carer") return true;
    
    // carer_profilesは単一オブジェクトを期待（maybeSingle相当で取得されることが多いため）
    // select("*, carer_profiles(*)") の場合、配列かオブジェクトかはSupabaseの設定やデータ構造によるが、
    // ここでは安全に配列かチェックする
    const cpArray = profile.carer_profiles as any[];
    const cp = Array.isArray(cpArray) ? cpArray[0] : cpArray;
    
    if (!cp) return true;

    // トピック検索中かつトピックが非公開設定なら除外
    if (topics && topics.length > 0 && cp.help_topic_visibility === "private") {
      return false;
    }
    // スタンス検索中かつスタンスが非公開設定なら除外
    if (stances && stances.length > 0 && cp.chat_stance_visibility === "private") {
      return false;
    }
    return true;
  });

  // 一致件数の計算とグルーピング
  const profilesWithMatchCount = validProfiles.map((profile) => {
    let matchCount = 0;
    
    // help_topicsの一致
    if (topics && topics.length > 0 && profile.help_topics) {
      matchCount += profile.help_topics.filter((t: string) => topics.includes(t)).length;
    }
    
    // chat_stancesの一致
    if (stances && stances.length > 0 && profile.chat_stances) {
      matchCount += profile.chat_stances.filter((s: string) => stances.includes(s)).length;
    }

    return { ...profile, matchCount };
  });

  // 一致件数ごとにグループ化
  const groupedProfiles: { [key: number]: any[] } = {};
  profilesWithMatchCount.forEach((p) => {
    if (!groupedProfiles[p.matchCount]) {
      groupedProfiles[p.matchCount] = [];
    }
    groupedProfiles[p.matchCount].push(p);
  });

  // 一致件数が多い順にグループを取り出し、グループ内をシャッフルして結合
  const sortedMatchCounts = Object.keys(groupedProfiles)
    .map(Number)
    .sort((a, b) => b - a);

  let finalShuffledData: any[] = [];
  sortedMatchCounts.forEach((count) => {
    const group = groupedProfiles[count].sort(() => Math.random() - 0.5);
    finalShuffledData = [...finalShuffledData, ...group];
  });

  // 指定されたlimitに切り出して返却
  const resultData = finalShuffledData.slice(0, limit);

  return resultData.map((profile) => {
    const { carer_profiles, ...baseProfile } = profile;

    if (profile.role !== "carer") return baseProfile;

    // join結果が配列で返る場合があるため、最初の1件を取得
    const carerProfile = Array.isArray(carer_profiles) ? carer_profiles[0] : carer_profiles;
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
