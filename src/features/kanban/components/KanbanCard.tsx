"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskWithRelations } from "@/features/tasks/types";
import { Badge, getPriorityVariant } from "@/shared/components/ui/badge";
import { UserAvatar } from "@/shared/components/ui/user-avatar";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Calendar, Clock } from "lucide-react";

interface KanbanCardProps {
  task: TaskWithRelations;
}

export function KanbanCard({ task }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return "bg-green-500";
    if (progress >= 70) return "bg-blue-500";
    if (progress >= 40) return "bg-purple-500";
    return "bg-gray-500";
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group cursor-grab rounded-lg border border-white/10 bg-[#1A1A24] p-4 transition-all hover:border-white/20 hover:shadow-lg ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      {/* タイトルと優先度 */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="flex-1 text-sm font-medium text-white line-clamp-2">
          {task.title}
        </h3>
        <Badge variant={getPriorityVariant(task.priority)} className="shrink-0">
          {task.priority}
        </Badge>
      </div>

      {/* 説明 */}
      {task.description && (
        <p className="mb-3 text-xs text-gray-400 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* プロジェクト */}
      <div className="mb-3 flex items-center gap-2">
        <div
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: task.project.color }}
        />
        <span className="truncate text-xs text-gray-300">
          {task.project.name}
        </span>
      </div>

      {/* タグ */}
      {task.tags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1">
          {task.tags.map((tag, index) => (
            <span
              key={index}
              className="rounded border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 担当者と期限 */}
      <div className="mb-3 flex items-center justify-between">
        <UserAvatar
          image={task.assignee.image}
          name={task.assignee.name}
          size="sm"
        />
        {task.dueDate && (
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Calendar className="h-3 w-3" />
            <span>{format(task.dueDate, "MM/dd", { locale: ja })}</span>
          </div>
        )}
      </div>

      {/* 進捗バー */}
      {task.estimatedHours !== null && task.estimatedHours !== undefined && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-gray-400">
              <Clock className="h-3 w-3" />
              <span>
                {Math.round((task.progress / 100) * task.estimatedHours)}/
                {task.estimatedHours}h
              </span>
            </div>
            <span className="text-gray-500">{task.progress}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
            <div
              className={`h-full ${getProgressColor(task.progress)} transition-all`}
              style={{ width: `${task.progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
