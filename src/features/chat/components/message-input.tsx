"use client";

import { useState } from "react";
import { Send, CalendarDays } from "lucide-react";
import { RequestPopup } from "../../support/components/popup";

interface MessageInputProps {
  roomId: string;
  onSend: (content: string) => Promise<void>;
  showRequestButton?: boolean;
  currentUserId: string;
  otherPartyId: string;
  otherPartyName: string;
}

export function MessageInput({ 
  roomId,
  onSend, 
  showRequestButton, 
  currentUserId,
  otherPartyId,
  otherPartyName 
}: MessageInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isSending) return;

    const content = inputValue;
    setInputValue("");
    setIsSending(true);

    try {
      await onSend(content);
    } catch (error) {
      alert("メッセージの送信に失敗しました");
      setInputValue(content);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <form 
        onSubmit={handleSubmit}
        className="p-4 border-t border-gray-100 flex items-center space-x-2 bg-white"
      >
        {showRequestButton && (
          <button
            type="button"
            onClick={() => setShowPopup(true)}
            className="flex flex-col items-center justify-center p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors shrink-0"
            title="サポートを依頼する"
          >
            <CalendarDays size={20} />
            <span className="text-[10px] font-bold mt-0.5">依頼</span>
          </button>
        )}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="メッセージを入力..."
          className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          disabled={isSending}
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isSending}
          className="bg-blue-600 text-white p-2 rounded-full disabled:opacity-50 disabled:bg-gray-300 transition-colors shrink-0"
        >
          <Send size={20} />
        </button>
      </form>

      {showPopup && (
        <RequestPopup 
          onClose={() => setShowPopup(false)} 
          supporterName={otherPartyName} 
          roomId={roomId}
          carerId={currentUserId}
          supporterId={otherPartyId}
        />
      )}
    </>
  );
}
