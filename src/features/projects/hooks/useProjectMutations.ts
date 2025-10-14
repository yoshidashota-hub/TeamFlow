import { trpc } from "@/shared/lib/trpc";

export function useCreateProject() {
  const utils = trpc.useUtils();

  return trpc.projects.create.useMutation({
    onSuccess: () => {
      utils.projects.list.invalidate();
    },
  });
}

export function useUpdateProject() {
  const utils = trpc.useUtils();

  return trpc.projects.update.useMutation({
    onSuccess: (data) => {
      utils.projects.list.invalidate();
      utils.projects.getById.invalidate({ id: data.id });
    },
  });
}

export function useDeleteProject() {
  const utils = trpc.useUtils();

  return trpc.projects.delete.useMutation({
    onSuccess: () => {
      utils.projects.list.invalidate();
    },
  });
}
