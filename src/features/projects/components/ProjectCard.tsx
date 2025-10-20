"use client";

import type { Project } from "@prisma/client";
import { format } from "date-fns";
import { Edit2, Trash2, Calendar } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  onEdit: (projectId: string) => void;
  onDelete: (projectId: string) => void;
}

function getTaskStats() {
  return {
    notStarted: Math.floor(Math.random() * 3),
    inProgress: Math.floor(Math.random() * 3),
    completed: Math.floor(Math.random() * 3),
  };
}

// 期間進捗率を計算
function calculateDateProgress(
  startDate?: Date | null,
  endDate?: Date | null
): number {
  if (!startDate || !endDate) return 0;

  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) return 0;
  if (now > end) return 100;

  const total = end.getTime() - start.getTime();
  const elapsed = now.getTime() - start.getTime();

  return Math.round((elapsed / total) * 100);
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const stats = getTaskStats();
  const totalTasks = stats.notStarted + stats.inProgress + stats.completed;
  const taskProgress =
    totalTasks > 0 ? Math.round((stats.completed / totalTasks) * 100) : 0;
  const dateProgress = calculateDateProgress(
    project.startDate,
    project.endDate
  );

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-all hover:shadow-lg hover:shadow-purple-500/10">
      <div className="p-6">
        {/* ヘッダー */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* カラーアイコン */}
            <div
              className="w-8 h-8 rounded-lg flex-shrink-0"
              style={{ backgroundColor: project.color }}
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white truncate">
                {project.name}
              </h3>
              {project.description && (
                <p className="text-sm text-gray-400 line-clamp-2">
                  {project.description}
                </p>
              )}
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex items-center gap-1 ml-3">
            <button
              type="button"
              onClick={() => onEdit(project.id)}
              className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
              aria-label="編集"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(project.id)}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
              aria-label="削除"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* タスク進捗 */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">タスク進捗</span>
            <span className="text-sm text-gray-300">
              {stats.completed}/{totalTasks} ({taskProgress}%)
            </span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-300"
              style={{ width: `${taskProgress}%` }}
            />
          </div>
        </div>

        {/* 期間進捗 */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">期間進捗</span>
            <span className="text-sm text-gray-300">{dateProgress}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-pink-400 transition-all duration-300"
              style={{ width: `${dateProgress}%` }}
            />
          </div>
        </div>

        {/* 日付範囲 */}
        {(project.startDate || project.endDate) && (
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
            <Calendar className="w-4 h-4" />
            {project.startDate && (
              <span>{format(new Date(project.startDate), "yyyy年M月d日")}</span>
            )}
            {project.startDate && project.endDate && <span>-</span>}
            {project.endDate && (
              <span>{format(new Date(project.endDate), "yyyy年M月d日")}</span>
            )}
          </div>
        )}

        {/* ステータスバッジ */}
        <div className="flex items-center gap-2 flex-wrap">
          {stats.notStarted > 0 && (
            <span className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
              {stats.notStarted} 未着手
            </span>
          )}
          {stats.inProgress > 0 && (
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
              {stats.inProgress} 進行中
            </span>
          )}
          {stats.completed > 0 && (
            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
              {stats.completed} 完了
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
