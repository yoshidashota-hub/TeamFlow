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
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-5 py-2.5 font-medium text-white shadow-lg transition-all hover:from-blue-600 hover:to-purple-600 hover:shadow-xl"
          >
            <Plus className="h-5 w-5" />
            新規タスク
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
