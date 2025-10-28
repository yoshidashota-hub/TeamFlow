import { trpc } from "@/shared/lib/trpc";

/**
 * ガントチャート用のプロジェクトデータを取得するフック
 */
export function useGanttData() {
  return trpc.projects.getGanttData.useQuery();
}
