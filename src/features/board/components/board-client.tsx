"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { AvatarWithStatus } from "@/components/ui/avatar-with-status";
import { Badge } from "@/components/ui/badge";
import { sendBoard } from "../actions/send-board";
import { createClient } from "@/lib/supabase/client";
import { ChevronDown, ChevronUp } from "lucide-react";

interface BoardItem {
  id: number;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    display_name: string | null;
    role: "carer" | "supporter" | null;
    icon_url: string | null;
    user_activity?: {
      last_active_at: string;
    } | {
      last_active_at: string;
    }[] | null;
  } | null;
}

interface BoardClientProps {
  initialPosts: BoardItem[];
}

export default function BoardClient({ initialPosts }: BoardClientProps) {
  const router = useRouter();
  const [posts, setPosts] = useState<BoardItem[]>(initialPosts);
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isFormOpen, setIsFormOpen] = useState(true);

  // Propが更新されたらStateも同期する
  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  // Realtime サブスクリプションの設定
  useEffect(() => {
    const supabase = createClient();
    
    const channel = supabase
      .channel("board_realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "board",
        },
        async (payload) => {
          // 新しい投稿のプロフィール情報を取得
          const { data, error } = await supabase
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
            .eq("id", payload.new.id)
            .single();

          if (data && !error) {
            setPosts((prev) => {
              // 重複チェック
              if (prev.some((p) => p.id === data.id)) return prev;
              return [data as any, ...prev];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isPending) return;

    startTransition(async () => {
      try {
        await sendBoard(content);
        setContent("");
      } catch (error) {
        alert("投稿に失敗しました");
      }
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "たった今";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分前`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}時間前`;
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  return (
    <div className="max-w-2xl mx-auto pb-20">
      {/* 投稿フォーム */}
      <div className={`bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm ${isFormOpen ? "p-4" : "p-1"}`}>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          {isFormOpen && (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="いまどうしてる？"
              className="w-full p-3 bg-gray-50 border-none rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 resize-none min-h-[100px]"
              maxLength={280}
            />
          )}
          <div className="flex items-center relative min-h-[40px]">
            {isFormOpen && (
              <span className="text-xs text-gray-400 absolute left-0">{content.length}/280</span>
            )}
            
            <button
              type="button"
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="mx-auto p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
            >
              {isFormOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>

            {isFormOpen && (
              <button
                type="submit"
                disabled={!content.trim() || isPending}
                className="absolute right-0 px-6 py-2 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors disabled:bg-gray-300"
              >
                {isPending ? "投稿中..." : "投稿する"}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* 投稿一覧 */}
      <div className="divide-y divide-gray-100">
        {posts.map((post) => {
          const lastActiveAt = (post.profiles?.user_activity as any)?.last_active_at || 
                              (Array.isArray(post.profiles?.user_activity) ? post.profiles.user_activity[0]?.last_active_at : null);
          
          return (
            <div key={post.id} className="p-4 bg-white hover:bg-gray-50 transition-colors flex space-x-3">
              <Link href={`/profile/${post.user_id}`}>
                <AvatarWithStatus 
                  userId={post.user_id} 
                  initialLastActiveAt={lastActiveAt}
                  className="w-12 h-12 hover:opacity-80 transition-opacity" 
                />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <Link href={`/profile/${post.user_id}`} className="hover:underline flex items-center space-x-1">
                    <span className="font-bold text-gray-900 truncate max-w-[150px]">
                      {post.profiles?.display_name || "匿名ユーザー"}
                    </span>
                    <Badge variant={post.profiles?.role === "supporter" ? "primary" : "default"}>
                      {post.profiles?.role === "supporter" ? "サポーター" : "一般"}
                    </Badge>
                  </Link>
                  <span className="text-gray-500 text-xs">·</span>
                  <span className="text-gray-500 text-xs whitespace-nowrap">
                    {formatTime(post.created_at)}
                  </span>
                </div>
                <p className="text-gray-800 text-sm whitespace-pre-wrap break-words leading-relaxed">
                  {post.content}
                </p>
              </div>
            </div>
          );
        })}

        {posts.length === 0 && (
          <div className="p-10 text-center text-gray-500 text-sm">
            まだ投稿がありません
          </div>
        )}
      </div>
    </div>
  );
}
