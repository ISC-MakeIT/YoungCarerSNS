"use client";

import { Avatar } from "./avatar";
import { useOnlineStatus } from "@/features/profile/hooks/use-online-status";

interface AvatarWithStatusProps {
  userId: string;
  initialLastActiveAt?: string | null;
  className?: string;
}

export function AvatarWithStatus({ 
  userId, 
  initialLastActiveAt, 
  className = "",
  src = null
}: AvatarWithStatusProps & { src?: string | null }) {
  const { isOnline } = useOnlineStatus(userId, initialLastActiveAt);

  return (
    <Avatar 
      className={className} 
      showStatus 
      isOnline={isOnline} 
      src={src}
    />
  );
}
