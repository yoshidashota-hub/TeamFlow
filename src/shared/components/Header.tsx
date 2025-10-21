"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Bell,
  Users,
  LayoutDashboard,
  Kanban as KanbanIcon,
  GanttChart,
  List,
  FolderKanban,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { usePathname } from "next/navigation";

const navigationTabs = [
  {
    id: "dashboard",
    label: "ダッシュボード",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    id: "kanban",
    label: "カンバン",
    icon: KanbanIcon,
    href: "/dashboard/kanban",
  },
  {
    id: "gantt",
    label: "ガントチャート",
    icon: GanttChart,
    href: "/dashboard/gantt",
  },
  { id: "list", label: "リスト", icon: List, href: "/dashboard/tasks" },
  {
    id: "projects",
    label: "プロジェクト",
    icon: FolderKanban,
    href: "/dashboard/",
  },
];

export function Header() {
  const { user } = useAuth();
  const pathname = usePathname();

  return (
    <header className="bg-black border-b border-gray-800 sticky top-0 z-50">
      {/* トップバー */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* ロゴ */}
            <Link
              href="/dashboard"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <KanbanIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  TeamFlow
                </h1>
                <p className="text-[10px] text-gray-500 leading-none">
                  タスク管理&コラボレーション
                </p>
              </div>
            </Link>

            {/* 右側アイコン */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="通知"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <button
                type="button"
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="チームメンバー"
              >
                <Users className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 pl-3 border-l border-gray-800">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User"}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user?.name?.charAt(0).toUpperCase() || "G"}
                    </span>
                  </div>
                )}
                <span className="text-white text-sm font-medium">
                  {user?.name || "Google User"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ナビゲーションタブ */}
      <div className="container mx-auto px-6">
        <nav className="flex items-center gap-1">
          {navigationTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive =
              pathname === tab.href ||
              (tab.id === "projects" && pathname === "/dashboard");

            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
                  isActive ? "text-white" : "text-gray-400 hover:text-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
