"use client";

import { format } from "date-fns";
import { Edit2, Trash2, Calendar } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import type { ProjectWithTaskStats } from "../types/project.types";

interface ProjectCardProps {
  project: ProjectWithTaskStats;
  onEdit: (projectId: string) => void;
  onDelete: (projectId: string) => void;
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
  const { taskStats, taskProgress, totalTasks } = project;
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
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onEdit(project.id)}
              aria-label="編集"
              className="text-gray-400 hover:text-blue-400 hover:bg-blue-500/10"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onDelete(project.id)}
              aria-label="削除"
              className="text-gray-400 hover:text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* タスク進捗 */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">タスク進捗</span>
            <span className="text-sm text-gray-300">
              {taskStats.completed}/{totalTasks} ({taskProgress}%)
            </span>
          </div>
          <Progress value={taskProgress} className="h-2 bg-gray-700" />
        </div>

        {/* 期間進捗 */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">期間進捗</span>
            <span className="text-sm text-gray-300">{dateProgress}%</span>
          </div>
          <Progress value={dateProgress} className="h-2 bg-gray-700" />
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
          {taskStats.notStarted > 0 && (
            <Badge variant="notStarted">
              {taskStats.notStarted} 未着手
            </Badge>
          )}
          {taskStats.inProgress > 0 && (
            <Badge variant="inProgress">
              {taskStats.inProgress} 進行中
            </Badge>
          )}
          {taskStats.completed > 0 && (
            <Badge variant="completed">
              {taskStats.completed} 完了
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
