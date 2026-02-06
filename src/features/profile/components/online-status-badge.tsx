"use client";

import { useOnlineStatus } from "../hooks/use-online-status";

interface OnlineStatusBadgeProps {
  userId: string;
  initialLastActiveAt?: string | null;
  showLastActive?: boolean;
  className?: string;
}

export function OnlineStatusBadge({ 
  userId, 
  initialLastActiveAt, 
  showLastActive = true,
  className = "" 
}: OnlineStatusBadgeProps) {
  const { isOnline, lastActiveAt } = useOnlineStatus(userId, initialLastActiveAt);

  if (isOnline) {
    return (
      <div className={`flex items-center space-x-1 ${className}`}>
        <span className="relative flex h-2 w-2">
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span className="text-[10px] font-medium text-green-600">オンライン</span>
      </div>
    );
  }

  if (!showLastActive || !lastActiveAt) {
    return (
      <div className={`flex items-center space-x-1 ${className}`}>
        <span className="inline-flex rounded-full h-2 w-2 bg-gray-300"></span>
        <span className="text-[10px] font-medium text-gray-500">オフライン</span>
      </div>
    );
  }

  // 10分以上経過している場合の表示
  const lastActive = new Date(lastActiveAt);
  const now = new Date();
  const diffMs = now.getTime() - lastActive.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let timeStr = "";
  if (diffMins < 60) {
    timeStr = `${Math.max(1, diffMins)}分前`;
  } else if (diffHours < 24) {
    timeStr = `${diffHours}時間前`;
  } else if (diffDays < 7) {
    timeStr = `${diffDays}日前`;
  } else {
    timeStr = lastActive.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <span className="inline-flex rounded-full h-2 w-2 bg-gray-300"></span>
      <span className="text-[10px] font-medium text-gray-500">
        最終アクティブ：{timeStr}
      </span>
    </div>
  );
}
