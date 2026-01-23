"use client";

import { useState } from "react";
import { X, Loader2, Star } from "lucide-react";
import { sendReview } from "../actions/send-review";

interface ReviewPopupProps {
  onClose: () => void;
  onSuccess?: () => void;
  supportId: string;
  supporterId: string;
  reviewerId: string;
  roomId: string;
}

export function ReviewPopup({
  onClose,
  onSuccess,
  supportId,
  supporterId,
  reviewerId,
  roomId,
}: ReviewPopupProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comment, setComment] = useState("");

  const handleSend = async () => {
    if (!comment.trim()) return;
    
    setIsSubmitting(true);
    try {
      await sendReview({
        supportId,
        supporterId,
        reviewerId,
        comment,
        roomId,
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      alert(error instanceof Error ? error.message : "送信に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between bg-gray-50">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <Star className="text-yellow-500 fill-yellow-500" size={18} />
            サポートレビュー
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <p className="text-sm text-gray-600">
            サポートはいかがでしたか？<br />
            感謝の気持ちや感想を伝えてみましょう。
          </p>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              コメント <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="例：とても助かりました。ありがとうございました！"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none h-40"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={handleSend}
            disabled={!comment.trim() || isSubmitting}
            className="flex-[2] bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                送信中...
              </>
            ) : (
              "レビューを送信する"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
