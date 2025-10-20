"use client";

import type { Project } from "@prisma/client";
import { formatDistanceToNow, format } from "date-fns";
import { ja } from "date-fns/locale";

interface ProjectCardProps {
  project: Project;
  onEdit: (projectId: string) => void;
  onDelete: (projectId: string) => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 overflow-hidden">
      {/* カラーバー */}
      <div className="h-2" style={{ backgroundColor: project.color }} />

      <div className="p-5">
        {/* ヘッダー */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {project.name}
            </h3>
            {project.description && (
              <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                {project.description}
              </p>
            )}
            {/* 期間表示 */}
            {(project.startDate || project.endDate) && (
              <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {project.startDate && (
                  <span>
                    {format(new Date(project.startDate), "yyyy/MM/dd")}
                  </span>
                )}
                {project.startDate && project.endDate && <span>〜</span>}
                {project.endDate && (
                  <span>{format(new Date(project.endDate), "yyyy/MM/dd")}</span>
                )}
              </div>
            )}
          </div>

          {/* アクションメニュー */}
          <div className="flex items-center gap-1 ml-3">
            <button
              onClick={() => onEdit(project.id)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              aria-label="編集"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={() => onDelete(project.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              aria-label="削除"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* フッター */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            更新:{" "}
            {formatDistanceToNow(new Date(project.updatedAt), {
              addSuffix: true,
              locale: ja,
            })}
          </span>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
            開く →
          </button>
        </div>
      </div>
    </div>
  );
}
