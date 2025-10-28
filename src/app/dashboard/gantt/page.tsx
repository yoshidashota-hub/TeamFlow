"use client";

import { GanttChart, useGanttData } from "@/features/gantt";

export default function GanttPage() {
  const { data: projects, isLoading } = useGanttData();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-400">読み込み中...</div>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-2 text-lg text-gray-400">プロジェクトがありません</p>
          <p className="text-sm text-gray-500">プロジェクトを作成してください</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto px-6 py-8">
        <GanttChart projects={projects} />
      </div>
    </div>
  );
}
