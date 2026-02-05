"use client";

import { Avatar } from "@/components/ui/avatar";
import { Message } from "../types";
import { SupportCard } from "./support-card";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  otherPartyName: string;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

export function MessageList({ messages, currentUserId, otherPartyName, scrollRef }: MessageListProps) {
  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 space-y-4"
    >
      {messages.map((message) => {
        const isMine = message.sender_id === currentUserId;
        const isSupport = message.type === "support";

        return (
          <div
            key={message.id}
            className={`flex ${isMine ? "justify-end" : "justify-start"}`}
          >
            <div className={`flex ${isSupport ? "max-w-[90%]" : "max-w-[80%]"} ${isMine ? "flex-row-reverse" : "flex-row"}`}>
              {!isMine && (
                <div className="mr-2 mt-1 shrink-0">
                  <Avatar className="w-8 h-8" />
                </div>
              )}
              <div className={isSupport ? "flex-1 min-w-[300px]" : ""}>
                {!isMine && (
                  <p className="text-[10px] text-gray-500 mb-1 ml-1">{otherPartyName}</p>
                )}
                {isSupport ? (
                  <SupportCard 
                    support={message.supports || null} 
                    isMine={isMine}
                    roomId={message.room_id || ""}
                    currentUserId={currentUserId}
                  />
                ) : (
                  <div
                    className={`px-4 py-2 rounded-2xl text-sm ${
                      isMine
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-gray-100 text-gray-800 rounded-tl-none"
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words">{message.content}</div>
                  </div>
                )}
                <p className={`text-[10px] text-gray-400 mt-1 ${isMine ? "text-right mr-1" : "ml-1"}`}>
                  {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
