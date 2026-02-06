"use client";

import { Calendar, Clock, Info, Check, X, Play, Ban, Star } from "lucide-react";
import { updateSupportStatus } from "@/features/support/actions/update-support-status";
import { useState } from "react";
import { ReviewPopup } from "@/features/review/components/popup";
import { Support } from "../types";

interface SupportCardProps {
  support: Support | null;
  isMine: boolean;
  roomId: string;
  currentUserId: string;
}

export function SupportCard({ support, isMine, roomId, currentUserId }: SupportCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const [isReviewedLocally, setIsReviewedLocally] = useState(false);
  if (!support) return null;

  const hasReview = (support.reviews && support.reviews.length > 0) || isReviewedLocally;

  const STATUS_LABELS: Record<string, string> = {
    pending: "メッセージ確認中",
    accepted: "引き受け済み",
    ongoing: "サポート中",
    completed: "完了",
    cancelled: "キャンセル済み",
    rejected: "今回は難しい",
  };

  const handleStatusUpdate = async (newStatus: any) => {
    if (isUpdating) return;
    if (!confirm(`ステータスを「${STATUS_LABELS[newStatus]}」に変更しますか？`)) return;

    setIsUpdating(true);
    try {
      await updateSupportStatus({
        supportId: support.id,
        status: newStatus,
        roomId: roomId,
      });
    } catch (error) {
      alert("エラーが発生しました。もう一度お試しください。");
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "不明な日時";
      return date.toLocaleString("ja-JP", {
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "不明な日時";
    }
  };

  // アクションボタンのレンダリングロジック
  const renderActions = () => {
    if (isUpdating) return null;

    const buttons: React.ReactNode[] = [];

    // 依頼者（Carer）側の操作
    if (isMine) {
      if (support.status === "accepted") {
        buttons.push(
          <button
            key="start"
            onClick={() => handleStatusUpdate("ongoing")}
            className="flex-1 flex items-center justify-center gap-1 bg-blue-600 text-white py-2 px-3 rounded-xl font-bold text-xs hover:bg-blue-700 transition-colors"
          >
            <Play size={14} />
            サポート開始
          </button>
        );
      }
      if (support.status === "ongoing") {
        buttons.push(
          <button
            key="complete"
            onClick={() => handleStatusUpdate("completed")}
            className="flex-1 flex items-center justify-center gap-1 bg-green-600 text-white py-2 px-3 rounded-xl font-bold text-xs hover:bg-green-700 transition-colors"
          >
            <Check size={14} />
            完了
          </button>
        );
      }
      if (support.status === "completed" && !hasReview) {
        buttons.push(
          <button
            key="review"
            onClick={() => setShowReviewPopup(true)}
            className="flex-1 flex items-center justify-center gap-1 bg-yellow-500 text-white py-2 px-3 rounded-xl font-bold text-xs hover:bg-yellow-600 transition-colors"
          >
            <Star size={14} />
            レビューを書く
          </button>
        );
      }
      if (support.status === "pending" || support.status === "accepted") {
        buttons.push(
          <button
            key="cancel"
            onClick={() => handleStatusUpdate("cancelled")}
            className="flex-1 flex items-center justify-center gap-1 bg-white border border-red-200 text-red-600 py-2 px-3 rounded-xl font-bold text-xs hover:bg-red-50 transition-colors"
          >
            <Ban size={14} />
            依頼を取消
          </button>
        );
      }
    } else {
      // サポーター側の操作
      if (support.status === "pending") {
        buttons.push(
          <button
            key="accept"
            onClick={() => handleStatusUpdate("accepted")}
            className="flex-1 flex items-center justify-center gap-1 bg-green-600 text-white py-2 rounded-xl font-bold text-xs hover:bg-green-700 transition-colors"
          >
            <Check size={14} />
            引き受ける
          </button>
        );
        buttons.push(
          <button
            key="reject"
            onClick={() => handleStatusUpdate("rejected")}
            className="flex-1 flex items-center justify-center gap-1 bg-white border border-gray-300 text-gray-800 py-2 rounded-xl font-bold text-xs hover:bg-gray-50 transition-colors"
          >
            <X size={14} />
            今回は難しい
          </button>
        );
      }
    }

    if (buttons.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 pt-1">
        {buttons}
      </div>
    );
  };

  return (
    <div
      className={`p-4 rounded-2xl text-sm border-2 ${
        isMine
          ? "bg-blue-50 border-blue-200 text-blue-900 rounded-tr-none"
          : "bg-orange-50 border-orange-200 text-orange-900 rounded-tl-none"
      } shadow-sm w-full max-w-[500px] space-y-3`}
    >
      <div className="flex items-center gap-2 font-bold border-b pb-2 border-current/10">
        <Calendar size={18} className="shrink-0" />
        <span>サポート依頼</span>
      </div>
      
      <div className="space-y-3">
        <div>
          <p className="text-[10px] font-bold opacity-60 mb-0.5 uppercase">お願いしたいこと</p>
          <p className="font-medium bg-white/50 p-2 rounded-lg break-words whitespace-pre-wrap">
            {support.request_body}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-bold opacity-60 mb-0.5 uppercase">希望時間</p>
          <div className="flex items-center gap-1.5 font-medium">
            <Clock size={14} className="opacity-60" />
            <span>{formatDate(support.start_at)} ～ {formatDate(support.end_at)}</span>
          </div>
        </div>

        {support.request_note && (
          <div>
            <p className="text-[10px] font-bold opacity-60 mb-0.5 uppercase">追記・備考</p>
            <p className="p-2 border border-current/10 rounded-lg text-xs italic whitespace-pre-wrap">
              {support.request_note}
            </p>
          </div>
        )}

        <div className="pt-1 flex justify-between items-center text-[10px] font-bold opacity-50">
          <div className="flex items-center gap-1">
            <Info size={12} />
            <span>ステータス: {STATUS_LABELS[support.status || ""] || support.status}</span>
          </div>
        </div>

        {renderActions()}
      </div>

      {showReviewPopup && (
        <ReviewPopup
          onClose={() => setShowReviewPopup(false)}
          onSuccess={() => setIsReviewedLocally(true)}
          supportId={support.id}
          supporterId={support.supporter_id || ""}
          reviewerId={currentUserId}
          roomId={roomId}
        />
      )}
    </div>
  );
}
