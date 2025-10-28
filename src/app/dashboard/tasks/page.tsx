"use client";

import { TaskFilters } from "@/features/tasks/components/TaskFilters";
import { TaskList } from "@/features/tasks/components/TaskList";
import { CreateTaskModal } from "@/features/tasks/components/CreateTaskModal";
import { useTaskStore } from "@/features/tasks/store/taskStore";
import { Plus } from "lucide-react";

export default function TasksPage() {
  const openCreateModal = useTaskStore((state) => state.openCreateModal);

  return (
    <div className="min-h-screen bg-[#0A0A0F] p-8">
      <div className="mx-auto max-w-[1400px] space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-white">タスク管理</h1>
            <p className="text-gray-400">プロジェクトのタスクを一覧・管理できます</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-white transition-colors hover:bg-purple-500"
          >
            <Plus className="h-5 w-5" />
            <span className="font-medium">新規タスク</span>
          </button>
        </div>

        {/* 検索・フィルター */}
        <TaskFilters />

        {/* タスク一覧 */}
        <TaskList />
      </div>

      {/* タスク作成/編集モーダル */}
      <CreateTaskModal />
    </div>
  );
}
