"use client";

import { format } from "date-fns";
import { Edit, Trash2, Calendar } from "lucide-react";
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
function calculateDateProgress(startDate?: Date | null, endDate?: Date | null): number {
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
  const dateProgress = calculateDateProgress(project.startDate, project.endDate);

  return (
    <div className="overflow-hidden rounded-xl border border-white/5 bg-[#111114] backdrop-blur-sm transition-colors hover:border-[#6465f0] hover:bg-white/[0.02]">
      <div className="p-6">
        {/* ヘッダー */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            {/* カラーアイコン */}
            <div
              className="h-8 w-8 flex-shrink-0 rounded-lg"
              style={{ backgroundColor: project.color }}
            />
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-lg font-semibold text-white">{project.name}</h3>
              {project.description && (
                <p className="line-clamp-2 text-sm text-gray-400">{project.description}</p>
              )}
            </div>
          </div>

          {/* アクションボタン */}
          <div className="ml-3 flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onEdit(project.id)}
              aria-label="編集"
              className="text-gray-400 hover:bg-blue-500/10 hover:text-blue-400"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onDelete(project.id)}
              aria-label="削除"
              className="text-gray-400 hover:bg-red-500/10 hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* タスク進捗 */}
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-gray-400">タスク進捗</span>
            <span className="text-sm text-gray-300">
              {taskStats.completed}/{totalTasks} ({taskProgress}%)
            </span>
          </div>
          <Progress
            value={taskProgress}
            className="h-2 bg-gray-900"
            indicatorClassName="bg-gradient-to-r from-purple-500 to-purple-400"
          />
        </div>

        {/* 期間進捗 */}
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-gray-400">期間進捗</span>
            <span className="text-sm text-gray-300">{dateProgress}%</span>
          </div>
          <Progress
            value={dateProgress}
            className="h-2 bg-gray-900"
            indicatorClassName="bg-gradient-to-r from-pink-500 to-pink-400"
          />
        </div>

        {/* 日付範囲 */}
        {(project.startDate || project.endDate) && (
          <div className="mb-4 flex items-center gap-2 text-xs text-gray-400">
            <Calendar className="h-4 w-4" />
            {project.startDate && (
              <span>{format(new Date(project.startDate), "yyyy年M月d日")}</span>
            )}
            {project.startDate && project.endDate && <span>-</span>}
            {project.endDate && <span>{format(new Date(project.endDate), "yyyy年M月d日")}</span>}
          </div>
        )}

        {/* ステータスバッジ */}
        <div className="flex flex-wrap items-center gap-2">
          {taskStats.notStarted > 0 && (
            <Badge variant="notStarted">{taskStats.notStarted} 未着手</Badge>
          )}
          {taskStats.inProgress > 0 && (
            <Badge variant="inProgress">{taskStats.inProgress} 進行中</Badge>
          )}
          {taskStats.completed > 0 && <Badge variant="completed">{taskStats.completed} 完了</Badge>}
        </div>
      </div>
    </div>
  );
}
