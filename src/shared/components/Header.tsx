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
    href: "/dashboard/projects",
  },
];

export function Header() {
  const { user } = useAuth();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-black">
      {/* トップバー */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* ロゴ */}
            <Link
              href="/dashboard"
              className="flex items-center gap-2 transition-opacity hover:opacity-80"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                <KanbanIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-lg font-bold text-transparent">
                  TeamFlow
                </h1>
                <p className="text-[10px] leading-none text-gray-500">
                  タスク管理&コラボレーション
                </p>
              </div>
            </Link>

            {/* 右側アイコン */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="relative rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
                aria-label="通知"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"></span>
              </button>

              <button
                type="button"
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
                aria-label="チームメンバー"
              >
                <Users className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 border-l border-gray-800 pl-3">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User"}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500">
                    <span className="text-sm font-semibold text-white">
                      {user?.name?.charAt(0).toUpperCase() || "G"}
                    </span>
                  </div>
                )}
                <span className="text-sm font-medium text-white">
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
              tab.id === "dashboard"
                ? pathname === tab.href
                : pathname.startsWith(tab.href);

            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  isActive ? "text-white" : "text-gray-400 hover:text-gray-300"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                {isActive && (
                  <div className="absolute right-0 bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
