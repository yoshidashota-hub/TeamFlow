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
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">タスク管理</h1>
            <p className="text-gray-400">
              プロジェクトのタスクを一覧・管理できます
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-colors"
          >
            <Plus className="w-5 h-5" />
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
