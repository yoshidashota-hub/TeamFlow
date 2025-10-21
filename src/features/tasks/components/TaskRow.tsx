"use client";

import { TaskWithRelations } from "../types";
import { useDeleteTask } from "../hooks/useTasks";
import { useTaskStore } from "../store/taskStore";
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "未着手":
        return "bg-gray-500/10 text-gray-300 border-gray-500/20";
      case "進行中":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "レビュー":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "完了":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      default:
        return "bg-gray-500/10 text-gray-300 border-gray-500/20";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "低":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "中":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "高":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "緊急":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-300 border-gray-500/20";
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
        <span
          className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(
            task.status
          )}`}
        >
          {task.status}
        </span>
      </div>

      {/* 優先度 */}
      <div>
        <span
          className={`text-xs px-3 py-1 rounded-full border ${getPriorityColor(
            task.priority
          )}`}
        >
          {task.priority}
        </span>
      </div>

      {/* 期限 */}
      <div className="text-sm text-gray-300">
        {task.dueDate
          ? format(new Date(task.dueDate), "yyyy/MM/dd", { locale: ja })
          : "-"}
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
        <button
          type="button"
          onClick={handleEdit}
          aria-label="タスクを編集"
          className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleDelete}
          aria-label="タスクを削除"
          className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-red-400"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
