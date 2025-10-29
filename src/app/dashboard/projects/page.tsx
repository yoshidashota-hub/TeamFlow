"use client";

import {
  ProjectList,
  CreateProjectModal,
  EditProjectModal,
  DeleteProjectModal,
} from "@/features/projects";
import { useProjectModals } from "@/features/projects/hooks/useProjectModals";
import { Plus } from "lucide-react";

export default function ProjectsPage() {
  const {
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    selectedProjectId,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
  } = useProjectModals();

  return (
    <div className="min-h-screen bg-[#0A0A0F] p-8">
      <div className="mx-auto max-w-[1400px] space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-white">プロジェクト管理</h1>
            <p className="text-gray-400">プロジェクトを一覧・管理できます</p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-5 py-2.5 font-medium text-white shadow-lg transition-all hover:from-blue-600 hover:to-purple-600 hover:shadow-xl"
          >
            <Plus className="h-5 w-5" />
            新規プロジェクト
          </button>
        </div>

        {/* プロジェクト一覧 */}
        <ProjectList
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          onCreateClick={openCreateModal}
        />
      </div>

      {/* モーダル */}
      <CreateProjectModal isOpen={isCreateModalOpen} onClose={closeCreateModal} />
      <EditProjectModal
        isOpen={isEditModalOpen}
        projectId={selectedProjectId}
        onClose={closeEditModal}
      />
      <DeleteProjectModal
        isOpen={isDeleteModalOpen}
        projectId={selectedProjectId}
        onClose={closeDeleteModal}
      />
    </div>
  );
}
