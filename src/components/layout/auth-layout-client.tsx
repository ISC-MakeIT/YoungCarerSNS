"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, MessageCircle, MessageSquare } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { useTitle } from "./title-context";

export default function AuthLayoutClient({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId?: string;
}) {
  const pathname = usePathname();
  const { title, setTitle } = useTitle();

  const isChatRoom = pathname?.includes("/chat/") && pathname !== "/chat";

  const navItems = [
    { href: "/home", label: "ホーム", icon: Home },
    { href: "/matching", label: "マッチング", icon: Users },
    { href: "/chat", label: "チャット", icon: MessageCircle },
    { href: "/board", label: "掲示板", icon: MessageSquare },
  ];

  // パスが変わるごとにデフォルトのタイトルを設定（各コンポーネントで上書き可能）
  useEffect(() => {
    if (pathname === "/home") setTitle("ホーム");
    else if (pathname === "/matching") setTitle("マッチング");
    else if (pathname === "/chat") setTitle("チャット");
    else if (pathname === "/board") setTitle("掲示板");
  }, [pathname, setTitle]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <header className="flex-none bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-800">{title}</h1>
        <Link href={userId ? `/profile/${userId}` : "/profile/edit"}>
          <Avatar className="w-8 h-8 pointer-events-none" />
        </Link>
      </header>

      <main className={`flex-1 ${isChatRoom ? "overflow-hidden" : "overflow-y-auto"} relative overscroll-none`}>
        {children}
      </main>

      <nav className="flex-none bg-white border-t border-gray-200 flex justify-around items-center py-2 px-4 z-10">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center space-y-1 ${
                isActive ? "text-blue-600" : "text-gray-500"
              }`}
            >
              <Icon size={24} />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
