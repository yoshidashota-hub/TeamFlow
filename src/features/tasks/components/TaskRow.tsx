"use client";

import { TaskWithRelations } from "../types";
import { useDeleteTask } from "../hooks/useTasks";
import { useTaskStore } from "../store/taskStore";
import { Button } from "@/shared/components/ui/button";
import { Badge, getStatusVariant, getPriorityVariant } from "@/shared/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import Image from "next/image";

interface TaskRowProps {
  task: TaskWithRelations;
}

export function TaskRow({ task }: TaskRowProps) {
  const openEditModal = useTaskStore((state) => state.openEditModal);
  const deleteTask = useDeleteTask();

  const handleEdit = () => {
    openEditModal(task.id);
  };

  const handleDelete = () => {
    if (confirm("このタスクを削除してもよろしいですか？")) {
      deleteTask.mutate({ id: task.id });
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return "bg-green-500";
    if (progress >= 70) return "bg-blue-500";
    if (progress >= 40) return "bg-purple-500";
    return "bg-gray-500";
  };

  return (
    <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1fr_1fr_0.5fr] gap-4 items-center border-b border-white/5 py-4 px-4 hover:bg-white/[0.02] transition-colors">
      {/* タスク */}
      <div>
        <h3 className="text-sm font-medium text-white mb-1">{task.title}</h3>
        <div className="flex gap-2">
          {task.tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs px-2 py-0.5 rounded-md bg-white/5 text-gray-300 border border-white/10"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* プロジェクト */}
      <div className="flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: task.project.color }}
        />
        <span className="text-sm text-gray-300">{task.project.name}</span>
      </div>

      {/* 担当者 */}
      <div className="flex items-center gap-2">
        {task.assignee.image ? (
          <Image
            src={task.assignee.image}
            alt={task.assignee.name || ""}
            width={24}
            height={24}
            className="rounded-full"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
            <span className="text-xs text-purple-400">
              {task.assignee.name?.[0] || "?"}
            </span>
          </div>
        )}
        <span className="text-sm text-gray-300">{task.assignee.name}</span>
      </div>

      {/* ステータス */}
      <div>
        <Badge variant={getStatusVariant(task.status)}>
          {task.status}
        </Badge>
      </div>

      {/* 優先度 */}
      <div>
        <Badge variant={getPriorityVariant(task.priority)}>
          {task.priority}
        </Badge>
      </div>

      {/* 期間 */}
      <div className="text-sm text-gray-300">
        {task.startDate || task.dueDate ? (
          <div className="flex flex-col gap-0.5">
            {task.startDate && (
              <div className="text-xs text-gray-400">
                {format(new Date(task.startDate), "yyyy/MM/dd", { locale: ja })}
              </div>
            )}
            {task.startDate && task.dueDate && (
              <div className="text-xs text-gray-500">〜</div>
            )}
            {task.dueDate && (
              <div className="text-xs">
                {format(new Date(task.dueDate), "yyyy/MM/dd", { locale: ja })}
              </div>
            )}
          </div>
        ) : (
          "-"
        )}
      </div>

      {/* 進捗 */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className={`h-full ${getProgressColor(
              task.progress
            )} transition-all`}
            style={{ width: `${task.progress}%` }}
          />
        </div>
        <span className="text-xs text-gray-400 w-8 text-right">
          {task.progress}%
        </span>
      </div>

      {/* 操作 */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleEdit}
          aria-label="タスクを編集"
          className="text-gray-400 hover:text-white"
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleDelete}
          aria-label="タスクを削除"
          className="text-gray-400 hover:text-red-400"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
