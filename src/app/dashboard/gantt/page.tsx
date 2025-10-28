"use client";

import { GanttChart, useGanttData } from "@/features/gantt";

export default function GanttPage() {
  const { data: projects, isLoading } = useGanttData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400">読み込み中...</div>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-2">
            プロジェクトがありません
          </p>
          <p className="text-gray-500 text-sm">
            プロジェクトを作成してください
          </p>
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
