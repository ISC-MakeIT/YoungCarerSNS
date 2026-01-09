"use client";

import { Calendar, Clock, Info } from "lucide-react";

interface SupportCardProps {
  support: {
    request_body: string | null;
    start_at: string | null;
    end_at: string | null;
    request_note: string | null;
    status: string | null;
  } | null;
  isMine: boolean;
}

export function SupportCard({ support, isMine }: SupportCardProps) {
  if (!support) return null;

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

  return (
    <div
      className={`p-4 rounded-2xl text-sm border-2 ${
        isMine
          ? "bg-blue-50 border-blue-200 text-blue-900 rounded-tr-none"
          : "bg-orange-50 border-orange-200 text-orange-900 rounded-tl-none"
      } shadow-sm w-full max-w-[280px] space-y-3`}
    >
      <div className="flex items-center gap-2 font-bold border-b pb-2 border-current/10">
        <Calendar size={18} className="shrink-0" />
        <span>サポート依頼</span>
      </div>
      
      <div className="space-y-3">
        <div>
          <p className="text-[10px] font-bold opacity-60 mb-0.5 uppercase">お願いしたいこと</p>
          <p className="font-medium bg-white/50 p-2 rounded-lg break-words">
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
            <p className="p-2 border border-current/10 rounded-lg text-xs italic">
              {support.request_note}
            </p>
          </div>
        )}

        <div className="pt-1 flex justify-between items-center text-[10px] font-bold opacity-50">
          <div className="flex items-center gap-1">
            <Info size={12} />
            <span>ステータス: {support.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
