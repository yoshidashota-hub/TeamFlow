import { trpc } from "@/shared/lib/trpc";
import { useTaskStore } from "../store/taskStore";

export function useTasks() {
  const filters = useTaskStore((state) => state.filters);

  const { data: tasks, isLoading, error, refetch } = trpc.tasks.list.useQuery(filters);

  return {
    tasks: tasks ?? [],
    isLoading,
    error,
    refetch,
  };
}

export function useTask(taskId: string | null) {
  const { data: task, isLoading, error } = trpc.tasks.getById.useQuery(
    { id: taskId! },
    { enabled: !!taskId }
  );

  return {
    task,
    isLoading,
    error,
  };
}

export function useCreateTask() {
  const utils = trpc.useContext();
  const closeModal = useTaskStore((state) => state.closeCreateModal);

  const mutation = trpc.tasks.create.useMutation({
    onSuccess: () => {
      utils.tasks.list.invalidate();
      closeModal();
    },
  });

  return mutation;
}

export function useUpdateTask() {
  const utils = trpc.useContext();
  const closeModal = useTaskStore((state) => state.closeEditModal);

  const mutation = trpc.tasks.update.useMutation({
    onSuccess: () => {
      utils.tasks.list.invalidate();
      closeModal();
    },
  });

  return mutation;
}

export function useDeleteTask() {
  const utils = trpc.useContext();

  const mutation = trpc.tasks.delete.useMutation({
    onSuccess: () => {
      utils.tasks.list.invalidate();
    },
  });

  return mutation;
}

export function useAllTags() {
  const { data: tags, isLoading } = trpc.tasks.getAllTags.useQuery();

  return {
    tags: tags ?? [],
    isLoading,
  };
}
