"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Send } from "lucide-react";
import { sendMessage } from "../actions/send-message";
import { Avatar } from "@/components/main/avatar";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

interface ChatProps {
  roomId: string;
  initialMessages: Message[];
  currentUserId: string;
  otherPartyName: string;
}

export default function Chat({ roomId, initialMessages, currentUserId, otherPartyName }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    // スクロールを一番下に移動
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // リアルタイム購読の設定
    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => {
            // 重複チェック（自分が送信したメッセージが既にリストにある場合があるため）
            if (prev.find((m) => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, supabase]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const content = inputValue;
    setInputValue("");

    try {
      await sendMessage(roomId, content);
      // Server Action 経由で送信。リアルタイム購読で自分にも届くが、
      // ユーザー体験向上のために楽観的更新をしても良い。
    } catch (error) {
      console.error(error);
      alert("メッセージの送信に失敗しました");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-white">
      {/* メッセージエリア */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((message) => {
          const isMine = message.sender_id === currentUserId;
          return (
            <div
              key={message.id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex max-w-[80%] ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                {!isMine && (
                  <div className="mr-2 mt-1">
                    <Avatar className="w-8 h-8" />
                  </div>
                )}
                <div>
                  {!isMine && (
                    <p className="text-[10px] text-gray-500 mb-1 ml-1">{otherPartyName}</p>
                  )}
                  <div
                    className={`px-4 py-2 rounded-2xl text-sm ${
                      isMine
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-gray-100 text-gray-800 rounded-tl-none"
                    }`}
                  >
                    {message.content}
                  </div>
                  <p className={`text-[10px] text-gray-400 mt-1 ${isMine ? "text-right mr-1" : "ml-1"}`}>
                    {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 入力エリア */}
      <form 
        onSubmit={handleSend}
        className="p-4 border-t border-gray-100 flex items-center space-x-2 bg-white"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="メッセージを入力..."
          className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="bg-blue-600 text-white p-2 rounded-full disabled:opacity-50 disabled:bg-gray-300 transition-colors"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
