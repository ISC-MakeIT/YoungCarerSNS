import { User } from "lucide-react";

export function Avatar({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-gray-200 rounded-full flex items-center justify-center text-gray-500 overflow-hidden ${className}`}>
      <User size="70%" />
    </div>
  );
}
