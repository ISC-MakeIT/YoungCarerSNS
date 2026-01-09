"use client";

import { useChat } from "../hooks/use-chat";
import { MessageList } from "./message-list";
import { MessageInput } from "./message-input";
import { Message } from "../types";

interface ChatClientProps {
  roomId: string;
  initialMessages: Message[];
  currentUserId: string;
  currentUserRole: string | null;
  otherPartyName: string;
  otherPartyRole: string | null;
}

export default function ChatClient({ 
  roomId, 
  initialMessages, 
  currentUserId, 
  currentUserRole,
  otherPartyName,
  otherPartyRole
}: ChatClientProps) {
  const { messages, send, scrollRef } = useChat(roomId, initialMessages);

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-white">
      <MessageList 
        messages={messages} 
        currentUserId={currentUserId} 
        otherPartyName={otherPartyName} 
        scrollRef={scrollRef} 
      />
      <MessageInput 
        onSend={send} 
        showRequestButton={currentUserRole === "carer" && otherPartyRole === "supporter"}
        otherPartyName={otherPartyName}
        roomId={roomId}
      />
    </div>
  );
}
