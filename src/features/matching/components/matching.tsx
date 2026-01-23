import { createClient } from "@/lib/supabase/server";
import MatchingClient from "./matching-client";
import { getMatchingProfiles } from "../api/matching";
import { getHelpTopicMaster, getChatStanceMaster } from "../../profile/api/master";

export default async function Matching() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // 自分とは異なるロールのユーザーを優先的に表示（簡易的なマッチングロジック）
  const [profiles, helpTopicMaster, chatStanceMaster] = await Promise.all([
    getMatchingProfiles(user.id),
    getHelpTopicMaster(),
    getChatStanceMaster(),
  ]);

  return (
    <MatchingClient 
      profiles={profiles} 
      helpTopicMaster={helpTopicMaster}
      chatStanceMaster={chatStanceMaster}
    />
  );
}
