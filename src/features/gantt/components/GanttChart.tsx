"use client";

import { useMemo } from "react";
import type { ProjectWithTasks } from "@/features/projects";

interface GanttChartProps {
  projects: ProjectWithTasks[];
}

// 月の配列を生成
function generateMonths(startDate: Date, endDate: Date) {
  const months: { year: number; month: number; label: string }[] = [];
  const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

  while (current <= end) {
    months.push({
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      label: `${current.getFullYear()}年${current.getMonth() + 1}月`,
    });
    current.setMonth(current.getMonth() + 1);
  }

  return months;
}

// タスクバーの位置とwidth を計算
// startDateが存在すればそれを使用、なければestimatedHoursから開始日を推定
function calculateTaskBar(
  task: ProjectWithTasks["tasks"][number],
  projectStart: Date | null,
  timelineStart: Date,
  timelineEnd: Date
) {
  if (!task.dueDate) return null;

  const end = new Date(task.dueDate);

  // 開始日を決定
  let start: Date;
  if (task.startDate) {
    // 実際の開始日が設定されている場合はそれを使用
    start = new Date(task.startDate);
  } else if (task.estimatedHours && task.estimatedHours > 0) {
    // 推定工数から開始日を計算（1日8時間として計算）
    const estimatedDays = Math.ceil(task.estimatedHours / 8);
    start = new Date(end);
    start.setDate(start.getDate() - estimatedDays);
  } else if (projectStart) {
    // プロジェクト開始日を使用
    start = new Date(projectStart);
  } else {
    // デフォルト: 終了日の7日前
    start = new Date(end);
    start.setDate(start.getDate() - 7);
  }

  // タスクがタイムライン範囲外の場合
  if (end < timelineStart || start > timelineEnd) return null;

  // クランプ: タイムライン内に収める
  const clampedStart = start < timelineStart ? timelineStart : start;
  const clampedEnd = end > timelineEnd ? timelineEnd : end;

  const totalDuration = timelineEnd.getTime() - timelineStart.getTime();
  const taskStartOffset = clampedStart.getTime() - timelineStart.getTime();
  const taskDuration = clampedEnd.getTime() - clampedStart.getTime();

  const leftPercent = (taskStartOffset / totalDuration) * 100;
  const widthPercent = (taskDuration / totalDuration) * 100;

  return {
    left: `${leftPercent}%`,
    width: `${widthPercent}%`,
  };
}

export function GanttChart({ projects }: GanttChartProps) {
  // タイムライン範囲を決定
  const { timelineStart, timelineEnd, months } = useMemo(() => {
    // 全プロジェクトとタスクから最小・最大日付を取得
    let minDate: Date | null = null;
    let maxDate: Date | null = null;

    projects.forEach((project) => {
      if (project.startDate) {
        const start = new Date(project.startDate);
        if (!minDate || start < minDate) minDate = start;
      }
      if (project.endDate) {
        const end = new Date(project.endDate);
        if (!maxDate || end > maxDate) maxDate = end;
      }

      project.tasks.forEach((task) => {
        if (task.dueDate) {
          const end = new Date(task.dueDate);
          if (!maxDate || end > maxDate) maxDate = end;

          // タスクの開始日を決定（実際の開始日または推定開始日）
          let taskStart: Date;
          if (task.startDate) {
            // 実際の開始日が設定されている場合はそれを使用
            taskStart = new Date(task.startDate);
          } else if (task.estimatedHours && task.estimatedHours > 0) {
            const estimatedDays = Math.ceil(task.estimatedHours / 8);
            taskStart = new Date(end);
            taskStart.setDate(taskStart.getDate() - estimatedDays);
          } else if (project.startDate) {
            taskStart = new Date(project.startDate);
          } else {
            taskStart = new Date(end);
            taskStart.setDate(taskStart.getDate() - 7);
          }

          if (!minDate || taskStart < minDate) minDate = taskStart;
        }
      });
    });

    // デフォルト値（データがない場合）
    const defaultStart = new Date(2025, 7, 1); // 2025年8月
    const defaultEnd = new Date(2026, 3, 30); // 2026年4月

    const start = minDate || defaultStart;
    const end = maxDate || defaultEnd;

    // 月の初めに調整
    const timelineStart = new Date(start.getFullYear(), start.getMonth(), 1);
    const timelineEnd = new Date(end.getFullYear(), end.getMonth() + 1, 0);

    const months = generateMonths(timelineStart, timelineEnd);

    return { timelineStart, timelineEnd, months };
  }, [projects]);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[1200px]">
        {/* ヘッダー */}
        <div className="flex border-b border-gray-700">
          <div className="w-80 flex-shrink-0 px-6 py-4">
            <h2 className="text-sm font-medium text-gray-400">タスク</h2>
          </div>
          <div className="flex flex-1">
            {months.map((month, index) => (
              <div
                key={index}
                className="flex-1 border-l border-gray-700 px-2 py-4 text-center text-sm text-gray-400"
              >
                {month.label}
              </div>
            ))}
          </div>
        </div>

        {/* プロジェクトとタスク */}
        {projects.map((project) => (
          <div key={project.id} className="border-b border-gray-800">
            {/* プロジェクトヘッダー */}
            <div className="flex items-center bg-gray-900/50 py-4">
              <div className="w-80 flex-shrink-0 px-6">
                <div className="flex items-center gap-3">
                  <div
                    className="h-6 w-6 flex-shrink-0 rounded-lg"
                    style={{ backgroundColor: project.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold text-white">{project.name}</h3>
                    {project.description && (
                      <p className="truncate text-xs text-gray-500">{project.description}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex-1" />
            </div>

            {/* タスク一覧 */}
            {project.tasks.length === 0 ? (
              <div className="flex px-6 py-4 text-sm text-gray-500">タスクがありません</div>
            ) : (
              project.tasks.map((task) => {
                const taskBar = calculateTaskBar(
                  task,
                  project.startDate,
                  timelineStart,
                  timelineEnd
                );

                return (
                  <div
                    key={task.id}
                    className="flex items-center py-3 transition-colors hover:bg-gray-800/30"
                  >
                    {/* タスク名 */}
                    <div className="w-80 flex-shrink-0 px-6">
                      <p className="truncate text-sm text-gray-300">{task.title}</p>
                    </div>

                    {/* タイムライン */}
                    <div className="relative h-8 flex-1">
                      {/* グリッド線 */}
                      <div className="absolute inset-0 flex">
                        {months.map((_, index) => (
                          <div key={index} className="flex-1 border-l border-gray-800" />
                        ))}
                      </div>

                      {/* タスクバー */}
                      {taskBar && (
                        <div
                          className="absolute top-1/2 flex h-6 -translate-y-1/2 items-center justify-center rounded-full px-2"
                          style={{
                            left: taskBar.left,
                            width: taskBar.width,
                            backgroundColor: project.color,
                          }}
                        >
                          <span className="truncate text-xs font-medium text-white">
                            {task.title.length > 20
                              ? `${task.title.substring(0, 20)}...`
                              : task.title}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
