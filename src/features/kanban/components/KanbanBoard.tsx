"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { TaskWithRelations, TaskStatus } from "@/features/tasks/types";
import { useUpdateTask } from "@/features/tasks/hooks/useTasks";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanCard } from "./KanbanCard";

interface KanbanBoardProps {
  tasksByStatus: Record<string, TaskWithRelations[]>;
}

const STATUSES = [
  TaskStatus.NOT_STARTED,
  TaskStatus.IN_PROGRESS,
  TaskStatus.REVIEW,
  TaskStatus.COMPLETED,
];

const STATUS_COLORS: Record<string, string> = {
  [TaskStatus.NOT_STARTED]: "#6B7280",
  [TaskStatus.IN_PROGRESS]: "#3B82F6",
  [TaskStatus.REVIEW]: "#8B5CF6",
  [TaskStatus.COMPLETED]: "#10B981",
};

export function KanbanBoard({ tasksByStatus }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<TaskWithRelations | null>(null);
  const updateTask = useUpdateTask();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const taskId = active.id as string;

    // 全てのタスクから該当タスクを見つける
    const task = Object.values(tasksByStatus)
      .flat()
      .find((t) => t.id === taskId);

    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      return;
    }

    const taskId = active.id as string;
    const newStatus = over.id as string;

    // 元のタスクを見つける
    const task = Object.values(tasksByStatus)
      .flat()
      .find((t) => t.id === taskId);

    if (task && task.status !== newStatus) {
      // ステータスを更新
      updateTask.mutate({
        id: taskId,
        status: newStatus,
      });
    }

    setActiveTask(null);
  };

  const handleDragCancel = () => {
    setActiveTask(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex gap-6 overflow-x-auto pb-4">
        {STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasksByStatus[status] || []}
            color={STATUS_COLORS[status]}
          />
        ))}
      </div>

      <DragOverlay>{activeTask ? <KanbanCard task={activeTask} /> : null}</DragOverlay>
    </DndContext>
  );
}
