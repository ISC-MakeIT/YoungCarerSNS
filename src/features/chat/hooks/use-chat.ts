"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { sendMessage } from "../actions/send-message";
import { Message } from "../types";

export function useChat(roomId: string, initialMessages: Message[]) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const scrollRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
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
        async (payload) => {
          const newMessage = payload.new as Message;
          
          // サポートメッセージの場合、詳細情報を取得
          if (newMessage.type === "support" && newMessage.support_id) {
            const { data: support } = await supabase
              .from("supports")
              .select("*")
              .eq("id", newMessage.support_id)
              .single();
            
            if (support) {
              newMessage.supports = support;
            }
          }

          setMessages((prev) => {
            if (prev.find((m) => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "supports",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const updatedSupport = payload.new;
          setMessages((prev) => 
            prev.map((msg) => 
              msg.support_id === updatedSupport.id 
                ? { ...msg, supports: updatedSupport } 
                : msg
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, supabase]);

  const send = async (content: string) => {
    if (!content.trim()) return;
    try {
      await sendMessage(roomId, content);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    messages,
    send,
    scrollRef,
    scrollToBottom,
  };
}
