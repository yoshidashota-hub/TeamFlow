import { trpc } from "@/shared/lib/trpc";

export function useProjects() {
  return trpc.projects.list.useQuery();
}

export function useProject(id: string) {
  return trpc.projects.getById.useQuery({ id });
}
