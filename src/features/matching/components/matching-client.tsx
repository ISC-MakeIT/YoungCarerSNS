"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { startChat } from "../actions/start-chat";

interface Profile {
  id: string;
  display_name: string | null;
  role: string | null;
  prefecture: string | null;
  bio: string | null;
  help_topics: string[] | null;
}

interface MatchingClientProps {
  profiles: Profile[];
}

export default function MatchingClient({ profiles }: MatchingClientProps) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleStartChat = (userId: string) => {
    startTransition(async () => {
      try {
        const result = await startChat(userId);
        if (result?.roomId) {
          router.push(`/chat/${result.roomId}`);
        }
      } catch (error) {
        console.error(error);
        alert("チャットの開始に失敗しました");
      }
    });
  };

  return (
    <div className="p-4 space-y-4">
      <p className="text-sm text-gray-600 px-1">あなたに似た境遇の方が見つかりました</p>
      
      <div className="space-y-3">
        {profiles.length > 0 ? (
          profiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
            >
              <div className="p-4 flex items-start space-x-3">
                <Avatar className="w-12 h-12" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900">{profile.display_name || "匿名ユーザー"}</h3>
                      <p className="text-xs text-gray-500">
                        {profile.role === "carer" ? "ヤングケアラー" : "サポーター"} / {profile.prefecture || "地域未設定"}
                      </p>
                    </div>
                    <button
                      onClick={() => setExpandedId(expandedId === profile.id ? null : profile.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {expandedId === profile.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                  
                  <div className="mt-2 flex flex-wrap gap-1">
                    {profile.help_topics?.map((tag) => (
                      <Badge key={tag}>#{tag}</Badge>
                    ))}
                  </div>

                  {expandedId === profile.id && (
                    <div className="mt-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-1">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {profile.bio || "自己紹介はまだありません。"}
                      </p>
                      <button
                        onClick={() => handleStartChat(profile.id)}
                        disabled={isPending}
                        className="mt-4 w-full py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                      >
                        {isPending ? "準備中..." : "メッセージを送る"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500 text-sm">
            マッチング候補が見つかりませんでした
          </div>
        )}
      </div>
    </div>
  );
}
