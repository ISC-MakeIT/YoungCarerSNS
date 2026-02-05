"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { AvatarWithStatus } from "@/components/ui/avatar-with-status";
import { Badge } from "@/components/ui/badge";
import { OnlineStatusBadge } from "../../profile/components/online-status-badge";
import { startChat } from "../actions/start-chat";
import { getFilteredProfiles } from "../actions/get-filtered-profiles";
import type { HelpTopicMaster, ChatStanceMaster } from "../../profile/types";
import MatchingSearchSheet from "./matching-search-sheet";

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
  last_active_at?: string | null;
}

interface MatchingClientProps {
  initialProfiles: Profile[];
  helpTopicMaster: HelpTopicMaster[];
  chatStanceMaster: ChatStanceMaster[];
  currentUserRole: "carer" | "supporter" | null;
  initialFilters?: {
    topics: string[];
    stances: string[];
    q: string;
    role: "carer" | "supporter" | "all";
  };
}

export default function MatchingClient({ 
  initialProfiles, 
  helpTopicMaster, 
  chatStanceMaster,
  currentUserRole,
  initialFilters
}: MatchingClientProps) {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);
  
  // 検索シートの表示用。初期状態やリセット時は「何も選択されていない」状態にする
  const [currentFilters, setCurrentFilters] = useState({
    topics: [] as string[],
    stances: [] as string[],
    q: "",
    role: "all" as "carer" | "supporter" | "all"
  });

  const handleApplySearch = (filters: { 
    topics: string[]; 
    stances: string[]; 
    q: string;
    role: "carer" | "supporter" | "all";
  }) => {
    startTransition(async () => {
      try {
        const results = await getFilteredProfiles(filters);
        setProfiles(results);
        setCurrentFilters(filters);
        setIsFiltered(true);
      } catch (error) {
        console.error(error);
        alert("検索に失敗しました");
      }
    });
  };

  const resetSearch = () => {
    startTransition(async () => {
        try {
          // 初期表示（自分へのレコメンド）の条件で再取得
          const results = await getFilteredProfiles({
            topics: initialFilters?.topics || [],
            stances: initialFilters?.stances || [],
            q: initialFilters?.q || "",
            role: initialFilters?.role || "all"
          });
          setProfiles(results);
          // UI上のフィルターはクリア
          setCurrentFilters({ topics: [], stances: [], q: "", role: "all" });
          setIsFiltered(false);
        } catch (error) {
          console.error(error);
        }
      });
  };

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
    <div className="p-4 space-y-4 pb-32">
      {/* 検索ステータス - ユーザーが明示的に検索を行った場合のみ表示 */}
      {isFiltered && (
        <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex items-center justify-between">
          <p className="text-xs text-blue-700 font-medium">
            検索条件を適用中
          </p>
          <button 
            onClick={resetSearch}
            className="text-xs text-blue-600 underline"
          >
            リセット
          </button>
        </div>
      )}

      <div className="space-y-3">
        {profiles.length > 0 ? (
          profiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
            >
              <div className="p-4 flex items-start space-x-3">
                <Link href={`/profile/${profile.id}`}>
                  <AvatarWithStatus 
                    userId={profile.id} 
                    initialLastActiveAt={profile.last_active_at}
                    className="w-12 h-12 hover:opacity-80 transition-opacity" 
                  />
                </Link>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <Link href={`/profile/${profile.id}`} className="hover:underline flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-gray-900">{profile.display_name || "匿名ユーザー"}</h3>
                      </div>
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
                      {!(currentUserRole === "supporter" && profile.role === "carer") && (
                        <button
                          onClick={() => handleStartChat(profile.id)}
                          disabled={isPending}
                          className="mt-4 w-full py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                        >
                          {isPending ? "準備中..." : "メッセージを送る"}
                        </button>
                      )}
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

      {/* 検索アクションボタン */}
      <div className="fixed bottom-20 left-0 right-0 p-4 max-w-2xl mx-auto pointer-events-none">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl flex items-center justify-center shadow-xl hover:bg-blue-700 active:scale-95 transition-all pointer-events-auto"
        >
          <Search size={22} className="mr-2" />
          条件を指定して探す
        </button>
      </div>

      <MatchingSearchSheet
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={handleApplySearch}
        helpTopicMaster={helpTopicMaster}
        chatStanceMaster={chatStanceMaster}
        initialFilters={currentFilters}
        currentUserRole={currentUserRole}
      />
    </div>
  );
}
