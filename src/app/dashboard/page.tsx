"use client";

import {
  ProjectList,
  CreateProjectModal,
  EditProjectModal,
  DeleteProjectModal,
} from "@/features/projects";
import { useProjectModals } from "@/features/projects/hooks/useProjectModals";
import { ProjectsHeader } from "./ProjectsHeader";

export default function DashboardPage() {
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
    <>
      <main className="min-h-screen bg-black">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <ProjectsHeader onCreateClick={openCreateModal} />

          <div className="mt-8">
            <ProjectList
              onEdit={openEditModal}
              onDelete={openDeleteModal}
              onCreateClick={openCreateModal}
            />
          </div>
        </div>
      </main>

      {/* Modals */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
      />
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
    </>
  );
}
