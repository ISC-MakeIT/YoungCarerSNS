import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BoardClient from "@/features/board/components/board-client";
import { SetTitle } from "@/components/layout/set-title";

export default async function BoardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 投稿を最新順に取得（プロフィール情報も結合）
  const { data: posts, error } = await supabase
    .from("board")
    .select(`
      id,
      content,
      created_at,
      user_id,
      profiles (
        display_name,
        role,
        icon_url,
        user_activity (
          last_active_at
        )
      )
    `)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching board:", error);
  }

  return (
    <>
      <SetTitle title="みんなの掲示板" />
      <BoardClient initialPosts={(posts as any) || []} />
    </>
  );
}
