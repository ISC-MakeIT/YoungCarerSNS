"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, MessageCircle } from "lucide-react";
import { Avatar } from "@/components/main/avatar";

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function MainLayout({ children, title = "YoungCarer SNS" }: MainLayoutProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/home", label: "ホーム", icon: Home },
    { href: "/matching", label: "マッチング", icon: Users },
    { href: "/chat", label: "チャット", icon: MessageCircle },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-800">{title}</h1>
        <Avatar className="w-8 h-8" />
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 px-4 z-10">
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
