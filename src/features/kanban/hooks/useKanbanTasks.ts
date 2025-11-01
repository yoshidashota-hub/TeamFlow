import { useMemo } from "react";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import { TaskWithRelations, TaskStatus } from "@/features/tasks/types";

export function useKanbanTasks() {
  const { tasks, isLoading, error, refetch } = useTasks();

  const tasksByStatus = useMemo(() => {
    const grouped: Record<string, TaskWithRelations[]> = {
      [TaskStatus.NOT_STARTED]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.REVIEW]: [],
      [TaskStatus.COMPLETED]: [],
    };

    tasks.forEach((task) => {
      if (grouped[task.status]) {
        grouped[task.status].push(task);
      }
    });

    return grouped;
  }, [tasks]);

  return {
    tasksByStatus,
    isLoading,
    error,
    refetch,
  };
}
