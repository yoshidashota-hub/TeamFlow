"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { useProject } from "../hooks/useProjects";
import { useDeleteProject } from "../hooks/useProjectMutations";
import { AlertTriangle } from "lucide-react";

interface DeleteProjectModalProps {
  isOpen: boolean;
  projectId: string | null;
  onClose: () => void;
}

export function DeleteProjectModal({ isOpen, projectId, onClose }: DeleteProjectModalProps) {
  const { data: project } = useProject(projectId || "");
  const deleteProject = useDeleteProject();

  const handleDelete = async () => {
    if (!projectId) return;

    try {
      await deleteProject.mutateAsync({ id: projectId });
      onClose();
    } catch (error) {
      console.error("プロジェクト削除エラー:", error);
    }
  };

  if (!project) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md border-gray-800 bg-gray-900 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">プロジェクトを削除</DialogTitle>
        </DialogHeader>
        <div className="mt-2 space-y-4">
          <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" />
              <div>
                <h4 className="text-sm font-medium text-red-300">この操作は取り消せません</h4>
                <p className="mt-1.5 text-sm text-red-400">
                  プロジェクト「
                  <span className="font-semibold">{project.name}</span>
                  」を削除しようとしています。
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-400">
            このプロジェクトに関連するすべてのデータが完全に削除されます。本当に削除しますか？
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-gray-800 px-6 py-2.5 font-medium text-gray-300 transition-colors hover:bg-gray-700"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteProject.isPending}
            className="rounded-lg bg-red-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleteProject.isPending ? "削除中..." : "削除する"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
