import { User } from "lucide-react";

export function Avatar({ 
  className = "", 
  isOnline = false,
  showStatus = false,
  src = null
}: { 
  className?: string;
  isOnline?: boolean;
  showStatus?: boolean;
  src?: string | null;
}) {
  return (
    <div className={`relative inline-block ${className}`}>
      <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-gray-500 overflow-hidden">
        {src ? (
          <img src={src} alt="" className="w-full h-full object-cover" />
        ) : (
          <User size="70%" />
        )}
      </div>
      {showStatus && (
        <span className={`absolute bottom-[5%] left-[5%] block h-[20%] w-[20%] rounded-full border-2 border-white ${isOnline ? 'bg-green-500' : 'bg-gray-300'}`} />
      )}
    </div>
  );
}
