"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { startChat } from "../actions/start-chat";
import type { HelpTopicMaster, ChatStanceMaster } from "../../profile/types";

interface Profile {
  id: string;
  display_name: string | null;
  role: string | null;
  prefecture: string | null;
  city: string | null;
  bio: string | null;
  help_topics: string[] | null;
  help_topic_other: string | null;
  chat_stances: string[] | null;
}

interface MatchingClientProps {
  profiles: Profile[];
  helpTopicMaster: HelpTopicMaster[];
  chatStanceMaster: ChatStanceMaster[];
}

export default function MatchingClient({ profiles, helpTopicMaster, chatStanceMaster }: MatchingClientProps) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const getHelpTopicLabel = (tagId: string, role: string | null) => {
    if (tagId === "非公開") return "非公開";
    const topic = helpTopicMaster.find(t => t.id === tagId);
    if (!topic) return tagId;
    return role === "supporter" ? topic.supporterLabel : topic.carerLabel;
  };

  const getChatStanceLabel = (stanceId: string, role: string | null) => {
    if (stanceId === "非公開") return "非公開";
    const stance = chatStanceMaster.find(s => s.id === stanceId);
    if (!stance) return stanceId;
    return role === "supporter" ? stance.supporterLabel : stance.carerLabel;
  };

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
      <div className="space-y-3">
        {profiles.length > 0 ? (
          profiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
            >
              <div className="p-4 flex items-start space-x-3">
                <Link href={`/profile/${profile.id}`}>
                  <Avatar className="w-12 h-12 hover:opacity-80 transition-opacity" />
                </Link>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <Link href={`/profile/${profile.id}`} className="hover:underline">
                      <h3 className="font-bold text-gray-900">{profile.display_name || "匿名ユーザー"}</h3>
                      <p className="text-xs text-gray-500">
                        {profile.role === "carer" ? "一般" : "サポーター"} / {profile.prefecture || "地域未設定"}{profile.city && ` ${profile.city}`}
                      </p>
                    </Link>
                    <button
                      onClick={() => setExpandedId(expandedId === profile.id ? null : profile.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {expandedId === profile.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                  
                  <div className="mt-2 flex flex-wrap gap-1">
                    {profile.help_topics?.map((tag) => (
                      <Badge key={tag} className="bg-blue-50 text-blue-700 border border-blue-100">{getHelpTopicLabel(tag, profile.role)}</Badge>
                    ))}
                    {profile.help_topic_other && (
                        <Badge className="bg-indigo-50 text-indigo-700 border border-indigo-100">{profile.help_topic_other}</Badge>
                    )}
                  </div>

                  <div className="mt-1 flex flex-wrap gap-1">
                    {profile.chat_stances?.map((stance) => (
                      <Badge key={stance} className="bg-green-50 text-green-700 border border-green-100">
                        {getChatStanceLabel(stance, profile.role)}
                      </Badge>
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
