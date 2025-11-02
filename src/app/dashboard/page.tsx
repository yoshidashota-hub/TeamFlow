"use client";

import Link from "next/link";
import { FolderKanban, ListTodo, GanttChartIcon, ArrowRight, Kanban } from "lucide-react";
import { Dashboard } from "@/features/dashboard";
import { trpc } from "@/shared/lib/trpc";

export default function DashboardPage() {
  // ダッシュボードデータの取得
  const { data, isLoading } = trpc.dashboard.getData.useQuery();

  return (
    <div className="min-h-screen bg-[#0A0A0F] p-8">
      <div className="mx-auto max-w-[1400px] space-y-8">
        {/* ヘッダー */}
        <div>
          <h1 className="mb-2 text-3xl font-bold text-white">ダッシュボード</h1>
          <p className="text-gray-400">プロジェクトとタスクの管理を一元化</p>
        </div>

        {/* クイックアクセス */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* プロジェクト管理 */}
          <Link
            href="/dashboard/projects"
            className="group rounded-xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-6 transition-all hover:border-white/20 hover:shadow-lg hover:shadow-blue-500/20"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                <FolderKanban className="h-6 w-6 text-white" />
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-white">プロジェクト管理</h2>
            <p className="text-sm text-gray-400">
              プロジェクトを作成・編集・管理できます
            </p>
          </Link>

          {/* タスク管理 */}
          <Link
            href="/dashboard/tasks"
            className="group rounded-xl border border-white/10 bg-gradient-to-br from-green-500/10 to-teal-500/10 p-6 transition-all hover:border-white/20 hover:shadow-lg hover:shadow-green-500/20"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-teal-500">
                <ListTodo className="h-6 w-6 text-white" />
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-white">タスク管理</h2>
            <p className="text-sm text-gray-400">
              タスクを作成・編集・進捗管理できます
            </p>
          </Link>

          {/* カンバン */}
          <Link
            href="/dashboard/kanban"
            className="group rounded-xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6 transition-all hover:border-white/20 hover:shadow-lg hover:shadow-purple-500/20"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                <Kanban className="h-6 w-6 text-white" />
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-white">カンバン</h2>
            <p className="text-sm text-gray-400">
              タスク管理&コラボレーション
            </p>
          </Link>

          {/* ガントチャート */}
          <Link
            href="/dashboard/gantt"
            className="group rounded-xl border border-white/10 bg-gradient-to-br from-orange-500/10 to-red-500/10 p-6 transition-all hover:border-white/20 hover:shadow-lg hover:shadow-orange-500/20"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-red-500">
                <GanttChartIcon className="h-6 w-6 text-white" />
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-white">ガントチャート</h2>
            <p className="text-sm text-gray-400">
              プロジェクトのスケジュールを可視化
            </p>
          </Link>
        </div>

        {/* ダッシュボード分析 */}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-gray-400">読み込み中...</p>
          </div>
        ) : data ? (
          <Dashboard tasks={data.tasks} projects={data.projects} />
        ) : null}
      </div>
    </div>
  );
}
