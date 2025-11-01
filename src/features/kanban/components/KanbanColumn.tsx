"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { TaskWithRelations } from "@/features/tasks/types";
import { KanbanCard } from "./KanbanCard";

interface KanbanColumnProps {
  status: string;
  tasks: TaskWithRelations[];
  color: string;
}

const statusColors: Record<string, string> = {
  未着手: "bg-gray-600",
  進行中: "bg-blue-600",
  レビュー: "bg-purple-600",
  完了: "bg-green-600",
};

export function KanbanColumn({ status, tasks, color }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const taskIds = tasks.map((task) => task.id);

  return (
    <div className="flex min-w-[320px] flex-1 flex-col">
      {/* カラムヘッダー */}
      <div
        className={`mb-4 flex items-center justify-between rounded-lg px-4 py-3 ${
          statusColors[status] || "bg-gray-600"
        }`}
      >
        <h3 className="text-sm font-semibold text-white">{status}</h3>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs font-medium text-white">
          {tasks.length}
        </span>
      </div>

      {/* タスクリスト */}
      <div
        ref={setNodeRef}
        className={`flex-1 space-y-3 rounded-lg border-2 border-dashed p-3 transition-colors ${
          isOver
            ? "border-blue-400 bg-blue-400/5"
            : "border-white/10 bg-white/[0.02]"
        }`}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex h-32 items-center justify-center text-sm text-gray-500">
            タスクがありません
          </div>
        )}
      </div>
    </div>
  );
}
