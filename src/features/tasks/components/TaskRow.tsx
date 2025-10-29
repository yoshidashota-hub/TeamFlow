"use client";

import { TaskWithRelations } from "../types";
import { useDeleteTask } from "../hooks/useTasks";
import { useTaskStore } from "../store/taskStore";
import { Button } from "@/shared/components/ui/button";
import { Badge, getStatusVariant, getPriorityVariant } from "@/shared/components/ui/badge";
import { UserAvatar } from "@/shared/components/ui/user-avatar";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

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
    <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1fr_1fr_0.5fr] items-center gap-4 border-b border-white/5 px-4 py-4 transition-colors hover:bg-white/[0.02]">
      {/* タスク */}
      <div>
        <h3 className="mb-1 text-sm font-medium text-white">{task.title}</h3>
        <div className="flex gap-2">
          {task.tags.map((tag, index) => (
            <span
              key={index}
              className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* プロジェクト */}
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: task.project.color }} />
        <span className="text-sm text-gray-300">{task.project.name}</span>
      </div>

      {/* 担当者 */}
      <UserAvatar
        image={task.assignee.image}
        name={task.assignee.name}
        size="md"
        showName
      />

      {/* ステータス */}
      <div>
        <Badge variant={getStatusVariant(task.status)}>{task.status}</Badge>
      </div>

      {/* 優先度 */}
      <div>
        <Badge variant={getPriorityVariant(task.priority)}>{task.priority}</Badge>
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
            {task.startDate && task.dueDate && <div className="text-xs text-gray-500">〜</div>}
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
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
          <div
            className={`h-full ${getProgressColor(task.progress)} transition-all`}
            style={{ width: `${task.progress}%` }}
          />
        </div>
        <span className="w-8 text-right text-xs text-gray-400">{task.progress}%</span>
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
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleDelete}
          aria-label="タスクを削除"
          className="text-gray-400 hover:text-red-400"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
