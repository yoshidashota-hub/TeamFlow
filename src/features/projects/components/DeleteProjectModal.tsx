"use client";

import { Modal } from "@/shared/components/Modal";
import { Button } from "@/shared/components/Button";
import { useProject } from "../hooks/useProjects";
import { useDeleteProject } from "../hooks/useProjectMutations";

interface DeleteProjectModalProps {
  isOpen: boolean;
  projectId: string | null;
  onClose: () => void;
}

export function DeleteProjectModal({
  isOpen,
  projectId,
  onClose,
}: DeleteProjectModalProps) {
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
    <Modal isOpen={isOpen} onClose={onClose} title="プロジェクトを削除">
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-red-800">
                この操作は取り消せません
              </h4>
              <p className="mt-1 text-sm text-red-700">
                プロジェクト「
                <span className="font-semibold">{project.name}</span>
                」を削除しようとしています。
              </p>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600">
          このプロジェクトに関連するすべてのデータが完全に削除されます。本当に削除しますか？
        </p>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            キャンセル
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            isLoading={deleteProject.isPending}
            className="flex-1"
          >
            削除する
          </Button>
        </div>
      </div>
    </Modal>
  );
}
