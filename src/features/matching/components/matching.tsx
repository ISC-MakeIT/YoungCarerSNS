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

  // 自分のプロフィールを取得して、関心のあるタグ（初期おすすめ用）を確認
  const { data: myProfile } = await supabase
    .from("profiles")
    .select("role, help_topics, chat_stances")
    .eq("id", user.id)
    .single();

  // 初期表示では、自分と異なるロールの人を優先しつつ、
  // 自分の設定しているタグに1つでも合致する人を優先的に取得
  const initialFilters = {
    topics: myProfile?.help_topics || [],
    stances: myProfile?.chat_stances || [],
    role: (myProfile?.role === "carer" ? "supporter" : "carer") as "carer" | "supporter" | "all",
    q: "",
  };

  const [profiles, helpTopicMaster, chatStanceMaster] = await Promise.all([
    getMatchingProfiles(user.id, {
        ...initialFilters,
        query: initialFilters.q,
    }),
    getHelpTopicMaster(),
    getChatStanceMaster(),
  ]);

  return (
    <MatchingClient 
      initialProfiles={profiles} 
      helpTopicMaster={helpTopicMaster}
      chatStanceMaster={chatStanceMaster}
      currentUserRole={myProfile?.role || null}
      initialFilters={initialFilters}
    />
  );
}
