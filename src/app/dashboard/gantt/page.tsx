"use client";

import { GanttChart, useGanttData } from "@/features/gantt";

export default function GanttPage() {
  const { data: projects, isLoading } = useGanttData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] p-8">
        <div className="mx-auto max-w-[1400px]">
          <div className="overflow-x-auto">
            <div className="min-w-[1200px]">
              {/* ヘッダースケルトン */}
              <div className="flex border-b border-gray-700 bg-gray-800/30">
                <div className="w-80 flex-shrink-0 px-6 py-4">
                  <div className="h-4 w-20 animate-pulse rounded bg-gray-700" />
                </div>
                <div className="flex flex-1">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 border-l border-gray-700 px-2 py-4 text-center"
                    >
                      <div className="mx-auto h-4 w-24 animate-pulse rounded bg-gray-700" />
                    </div>
                  ))}
                </div>
              </div>

              {/* プロジェクト/タスクスケルトン */}
              {[...Array(3)].map((_, projectIndex) => (
                <div key={projectIndex} className="border-b border-gray-800">
                  {/* プロジェクトヘッダースケルトン */}
                  <div className="flex items-center bg-gray-900/50 py-4">
                    <div className="w-80 flex-shrink-0 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-6 w-6 animate-pulse rounded-lg bg-gray-700" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-3/4 animate-pulse rounded bg-gray-700" />
                          <div className="h-3 w-1/2 animate-pulse rounded bg-gray-700" />
                        </div>
                      </div>
                    </div>
                    <div className="flex-1" />
                  </div>

                  {/* タスクスケルトン */}
                  {[...Array(4)].map((_, taskIndex) => (
                    <div key={taskIndex} className="flex items-center py-3">
                      <div className="w-80 flex-shrink-0 px-6">
                        <div className="h-4 w-2/3 animate-pulse rounded bg-gray-700" />
                      </div>
                      <div className="relative h-8 flex-1">
                        <div className="absolute inset-0 flex">
                          {[...Array(6)].map((_, i) => (
                            <div key={i} className="flex-1 border-l border-gray-800" />
                          ))}
                        </div>
                        <div
                          className="absolute top-1/2 h-6 -translate-y-1/2 animate-pulse rounded-full bg-gray-700"
                          style={{
                            left: `${(taskIndex * 15 + 10) % 70}%`,
                            width: `${20 + taskIndex * 5}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] p-8">
        <div className="mx-auto max-w-[1400px]">
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mb-2 text-lg font-medium text-gray-200">プロジェクトがありません</h3>
            <p className="mb-6 text-gray-400">プロジェクトを作成してタスクのスケジュールを可視化しましょう</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] p-8">
      <div className="mx-auto max-w-[1400px]">
        <GanttChart projects={projects} />
      </div>
    </div>
  );
}
