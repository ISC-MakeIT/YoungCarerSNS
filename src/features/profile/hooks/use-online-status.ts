"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * ユーザーのオンライン状態を判定・管理するフック
 * @param userId 対象のユーザーID
 * @param initialLastActiveAt 初期の最終アクティブ時刻（ISO String）
 */
export function useOnlineStatus(userId: string, initialLastActiveAt?: string | null) {
  const [isPresenceOnline, setIsPresenceOnline] = useState(false);
  const [lastActiveAt] = useState<string | null>(initialLastActiveAt || null);

  useEffect(() => {
    if (!userId) return;

    const supabase = createClient();
    // 自身、または他人のプレゼンスを確認するために同じ命名規則のチャンネルを購読
    const channel = supabase.channel(`presence:${userId}`);

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        // userIdがそのチャンネルに存在するか確認（trackされているキーがuserIdであることを期待）
        setIsPresenceOnline(!!state[userId]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // オンライン判定ロジック
  const getOnlineStatus = useCallback(() => {
    // 1. Presenceが有効ならオンライン
    if (isPresenceOnline) return true;

    // 2. last_active_atが10分以内ならオンライン
    if (lastActiveAt) {
      const lastActive = new Date(lastActiveAt).getTime();
      const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
      if (lastActive >= tenMinutesAgo) return true;
    }

    return false;
  }, [isPresenceOnline, lastActiveAt]);

  const [isOnline, setIsOnline] = useState(getOnlineStatus());

  useEffect(() => {
    // 秒単位の厳密さは求められないため、30秒おきに判定を更新
    const timer = setInterval(() => {
      setIsOnline(getOnlineStatus());
    }, 1000 * 30);
    
    setIsOnline(getOnlineStatus());
    
    return () => clearInterval(timer);
  }, [getOnlineStatus]);

  return { isOnline, lastActiveAt };
}
