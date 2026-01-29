"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MapPin, MessageCircle, Edit, ChevronDown, ChevronUp } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { startChat } from "../../matching/actions/start-chat";
import type { HelpTopicMaster, ChatStanceMaster } from "../types";

interface UserProfileProps {
  profile: any;
  isMyProfile: boolean;
  helpTopicMaster: HelpTopicMaster[];
  chatStanceMaster: ChatStanceMaster[];
  reviews: any[];
}

export default function UserProfile({ 
  profile, 
  isMyProfile, 
  helpTopicMaster,
  chatStanceMaster,
  reviews
}: UserProfileProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showAllReviews, setShowAllReviews] = useState(false);

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

  const handleStartChat = () => {
    startTransition(async () => {
      try {
        const result = await startChat(profile.id);
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
    <div className="max-w-2xl mx-auto pb-20">
      {/* ヘッダー部分 */}
      <div className="bg-white p-6 border-b border-gray-100 flex flex-col items-center">
        <Avatar className="w-24 h-24 mb-4" />
        <h2 className="text-xl font-bold text-gray-900">{profile.display_name || "匿名ユーザー"}</h2>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <Badge className="mr-2" variant={profile.role === "supporter" ? "primary" : "default"}>
            {profile.role === "supporter" ? "サポーター" : "一般"}
          </Badge>
          <div className="flex items-center">
            <MapPin size={14} className="mr-1" />
            {profile.prefecture || "地域未設定"}{profile.city && ` ${profile.city}`}
          </div>
        </div>
      </div>

      {/* 自己紹介 */}
      <div className="bg-white p-6 mt-2">
        <h3 className="text-sm font-bold text-gray-500 mb-3 underline decoration-blue-200 decoration-4 underline-offset-4">自己紹介</h3>
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {profile.bio || "自己紹介はまだありません。"}
        </p>
      </div>

      {/* 共通情報: 相談したいこと / サポートできること */}
      <div className="bg-white p-6 mt-2">
        <h3 className="text-sm font-bold text-gray-500 mb-3 underline decoration-blue-200 decoration-4 underline-offset-4">
          {profile.role === "supporter" ? "相談に乗れること" : "相談したいこと"}
        </h3>
        <div className="flex flex-wrap gap-2">
          {profile.help_topics && profile.help_topics.length > 0 ? (
            profile.help_topics.map((tag: string) => (
              <Badge key={tag} className="px-3 py-1 text-sm border border-blue-100 bg-blue-50 text-blue-700">
                {getHelpTopicLabel(tag, profile.role)}
              </Badge>
            ))
          ) : (
            null
          )}
          {profile.help_topic_other && (
            <Badge className="px-3 py-1 text-sm border border-indigo-100 bg-indigo-50 text-indigo-700">
              {profile.help_topic_other}
            </Badge>
          )}
          {(!profile.help_topics || profile.help_topics.length === 0) && !profile.help_topic_other && (
            <p className="text-sm text-gray-400">未設定</p>
          )}
        </div>
      </div>

      <div className="bg-white p-6 mt-2">
        <h3 className="text-sm font-bold text-gray-500 mb-3 underline decoration-blue-200 decoration-4 underline-offset-4">
          チャットの雰囲気
        </h3>
        <div className="flex flex-wrap gap-2">
          {profile.chat_stances && profile.chat_stances.length > 0 ? (
            profile.chat_stances.map((stance: string) => (
              <Badge key={stance} className="px-3 py-1 text-sm border border-green-100 bg-green-50 text-green-700">
                {getChatStanceLabel(stance, profile.role)}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-gray-400">未設定</p>
          )}
        </div>
      </div>

      {/* ケアラー固有情報 (家族状況のみ) */}
      {profile.role === "carer" && (
        <div className="bg-white p-6 mt-2">
          <h3 className="text-sm font-bold text-gray-500 mb-3 underline decoration-blue-200 decoration-4 underline-offset-4">家族状況</h3>
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{profile.family_situation || "未設定"}</p>
        </div>
      )}

      {/* サポーター固有情報 */}
      {profile.role === "supporter" && (
        <>
          <div className="bg-white p-6 mt-2">
            <h3 className="text-sm font-bold text-gray-500 mb-3 underline decoration-blue-200 decoration-4 underline-offset-4">ケア経験</h3>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {profile.care_experience || "未設定"}
            </p>
          </div>

          <div className="bg-white p-6 mt-2">
            <h3 className="text-sm font-bold text-gray-500 mb-3 underline decoration-blue-200 decoration-4 underline-offset-4">学習・活動背景</h3>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {profile.learning_background || "未設定"}
            </p>
          </div>
        </>
      )}

      {/* レビュー項目 (サポーターのみ表示) */}
      {profile.role === "supporter" && (
        <div className="bg-white p-6 mt-2 border-t border-gray-50">
          <h3 className="text-sm font-bold text-gray-500 mb-4 underline decoration-blue-200 decoration-4 underline-offset-4">
            届いたレビュー（{reviews.length}）
          </h3>
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {(showAllReviews ? reviews : reviews.slice(0, 3)).map((review: any) => (
                <div key={review.id} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                  <div className="flex justify-between items-start gap-4">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed flex-1">
                      {review.comment}
                    </p>
                    <span className="text-[10px] text-gray-400 shrink-0 mt-1">
                      {new Date(review.created_at).toLocaleDateString("ja-JP", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              ))}
              
              {reviews.length > 3 && (
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="w-full py-2 flex items-center justify-center text-sm text-blue-600 font-medium hover:bg-gray-50 rounded-lg transition-colors mt-2"
                >
                  {showAllReviews ? (
                    <>
                      <ChevronUp size={16} className="mr-1" />
                      閉じる
                    </>
                  ) : (
                    <>
                      <ChevronDown size={16} className="mr-1" />
                      すべてのレビューを表示（残り{reviews.length - 3}件）
                    </>
                  )}
                </button>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-400">まだレビューはありません</p>
          )}
        </div>
      )}

      {/* アクションボタン */}
      <div className="fixed bottom-20 left-0 right-0 p-4 max-w-2xl mx-auto">
        {isMyProfile ? (
          <button
            onClick={() => router.push("/profile/edit")}
            className="w-full py-3 bg-white border-2 border-blue-600 text-blue-600 font-bold rounded-xl flex items-center justify-center shadow-lg hover:bg-blue-50 transition-colors"
          >
            <Edit size={20} className="mr-2" />
            プロフィールを編集
          </button>
        ) : (
          <button
            onClick={handleStartChat}
            disabled={isPending}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            <MessageCircle size={20} className="mr-2" />
            {isPending ? "準備中..." : "メッセージを送る"}
          </button>
        )}
      </div>
    </div>
  );
}
