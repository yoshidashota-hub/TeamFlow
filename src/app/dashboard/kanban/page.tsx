"use client";

import { KanbanBoard, useKanbanTasks } from "@/features/kanban";
import { TaskFilters } from "@/features/tasks/components/TaskFilters";
import { CreateTaskModal } from "@/features/tasks/components/CreateTaskModal";
import { useTaskStore } from "@/features/tasks/store/taskStore";
import { Plus } from "lucide-react";

export default function KanbanPage() {
  const { tasksByStatus, isLoading } = useKanbanTasks();
  const openCreateModal = useTaskStore((state) => state.openCreateModal);

  return (
    <div className="min-h-screen bg-[#0A0A0F] p-8">
      <div className="mx-auto max-w-[1400px] space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-white">カンバン</h1>
            <p className="text-gray-400">タスク管理&コラボレーション</p>
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

        {/* カンバンボード */}
        {isLoading ? (
          <div className="flex gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="min-w-[320px] flex-1">
                <div className="mb-4 h-12 animate-pulse rounded-lg bg-gray-700" />
                <div className="space-y-3">
                  {[...Array(3)].map((_, j) => (
                    <div
                      key={j}
                      className="h-48 animate-pulse rounded-lg bg-gray-800"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <KanbanBoard tasksByStatus={tasksByStatus} />
        )}
      </div>

      {/* タスク作成モーダル */}
      <CreateTaskModal />
    </div>
  );
}
