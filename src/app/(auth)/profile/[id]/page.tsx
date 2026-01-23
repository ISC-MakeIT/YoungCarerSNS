import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/features/profile/api/profile";
import { getHelpTopicMaster, getChatStanceMaster } from "@/features/profile/api/master";
import UserProfile from "@/features/profile/components/user-profile";
import { SetTitle } from "@/components/layout/set-title";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProfilePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 自分のIDのページなら /profile へリダイレクトするなどの処理も考えられるが、
  // ここではそのまま表示するロジックにする（isMyProfileで判定）
  
  const [profile, helpTopicMaster, chatStanceMaster] = await Promise.all([
    getProfile(id),
    getHelpTopicMaster(),
    getChatStanceMaster(),
  ]);

  if (!profile) {
    notFound();
  }

  const isMyProfile = user.id === id;

  return (
    <>
      <SetTitle title={isMyProfile ? "マイプロフィール" : `${profile.display_name || "ユーザー"}のプロフィール`} />
      <UserProfile 
        profile={profile} 
        isMyProfile={isMyProfile} 
        helpTopicMaster={helpTopicMaster}
        chatStanceMaster={chatStanceMaster}
      />
    </>
  );
}
