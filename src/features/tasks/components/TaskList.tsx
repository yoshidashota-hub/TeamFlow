"use client";

import { useTasks } from "../hooks/useTasks";
import { TaskRow } from "./TaskRow";

export function TaskList() {
  const { tasks, isLoading, error } = useTasks();

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl">
        {/* テーブルヘッダー */}
        <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1fr_1fr_0.5fr] gap-4 border-b border-white/10 bg-white/[0.02] px-4 py-3">
          <div className="text-xs font-medium text-gray-400 uppercase">タスク</div>
          <div className="text-xs font-medium text-gray-400 uppercase">プロジェクト</div>
          <div className="text-xs font-medium text-gray-400 uppercase">担当者</div>
          <div className="text-xs font-medium text-gray-400 uppercase">ステータス</div>
          <div className="text-xs font-medium text-gray-400 uppercase">優先度</div>
          <div className="text-xs font-medium text-gray-400 uppercase">期間</div>
          <div className="text-xs font-medium text-gray-400 uppercase">進捗</div>
          <div className="text-xs font-medium text-gray-400 uppercase">操作</div>
        </div>

        {/* スケルトンローディング */}
        <div>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1fr_1fr_0.5fr] gap-4 border-b border-white/5 px-4 py-4 last:border-b-0"
            >
              <div className="animate-pulse space-y-2">
                <div className="h-4 w-3/4 rounded bg-gray-700" />
                <div className="h-3 w-1/2 rounded bg-gray-700" />
              </div>
              <div className="animate-pulse">
                <div className="h-6 w-20 rounded bg-gray-700" />
              </div>
              <div className="animate-pulse flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-gray-700" />
                <div className="h-4 w-16 rounded bg-gray-700" />
              </div>
              <div className="animate-pulse">
                <div className="h-6 w-16 rounded-full bg-gray-700" />
              </div>
              <div className="animate-pulse">
                <div className="h-6 w-16 rounded-full bg-gray-700" />
              </div>
              <div className="animate-pulse">
                <div className="h-4 w-24 rounded bg-gray-700" />
              </div>
              <div className="animate-pulse">
                <div className="h-4 w-12 rounded bg-gray-700" />
              </div>
              <div className="animate-pulse flex gap-1">
                <div className="h-8 w-8 rounded bg-gray-700" />
                <div className="h-8 w-8 rounded bg-gray-700" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-6 text-center">
        <svg
          className="mx-auto mb-3 h-12 w-12 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="font-medium text-red-300">タスクの読み込みに失敗しました</p>
        <p className="mt-1 text-sm text-red-400">{error.message}</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-700 bg-gray-800/30 p-12 text-center">
        <svg
          className="mx-auto mb-4 h-16 w-16 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 className="mb-2 text-lg font-medium text-gray-200">タスクがありません</h3>
        <p className="mb-6 text-gray-400">最初のタスクを作成してプロジェクトを進めましょう</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl">
      {/* テーブルヘッダー */}
      <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1fr_1fr_0.5fr] gap-4 border-b border-white/10 bg-white/[0.02] px-4 py-3">
        <div className="text-xs font-medium text-gray-400 uppercase">タスク</div>
        <div className="text-xs font-medium text-gray-400 uppercase">プロジェクト</div>
        <div className="text-xs font-medium text-gray-400 uppercase">担当者</div>
        <div className="text-xs font-medium text-gray-400 uppercase">ステータス</div>
        <div className="text-xs font-medium text-gray-400 uppercase">優先度</div>
        <div className="text-xs font-medium text-gray-400 uppercase">期間</div>
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
