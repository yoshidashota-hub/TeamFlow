"use client";

import Link from "next/link";
import Image from "next/image";
import { Bell, Users, Kanban } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function Header() {
  const { user } = useAuth();

  return (
    <header className="bg-[#1a1a1a] border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="relative w-11 h-11 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Kanban className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                TeamFlow
              </h1>
              <p className="text-gray-400 text-xs">
                タスク管理&コラボレーション
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <button
              className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="通知"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
            </button>

            <button
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="チームメンバー"
            >
              <Users className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-gray-800">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "User"}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
              )}
              <span className="text-white text-sm font-medium">
                {user?.name || ""}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
