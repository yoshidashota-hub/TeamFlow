"use client";

import { useTasks } from "../hooks/useTasks";
import { TaskRow } from "./TaskRow";

export function TaskList() {
  const { tasks, isLoading, error } = useTasks();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-400">エラーが発生しました</div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">タスクがありません</div>
      </div>
    );
  }

  return (
    <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
      {/* テーブルヘッダー */}
      <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1fr_1fr_0.5fr] gap-4 bg-white/[0.02] border-b border-white/10 py-3 px-4">
        <div className="text-xs font-medium text-gray-400 uppercase">タスク</div>
        <div className="text-xs font-medium text-gray-400 uppercase">
          プロジェクト
        </div>
        <div className="text-xs font-medium text-gray-400 uppercase">担当者</div>
        <div className="text-xs font-medium text-gray-400 uppercase">
          ステータス
        </div>
        <div className="text-xs font-medium text-gray-400 uppercase">優先度</div>
        <div className="text-xs font-medium text-gray-400 uppercase">期限</div>
        <div className="text-xs font-medium text-gray-400 uppercase">進捗</div>
        <div className="text-xs font-medium text-gray-400 uppercase">操作</div>
      </div>

      {/* テーブルボディ */}
      <div>
        {tasks.map((task) => (
          <TaskRow key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
