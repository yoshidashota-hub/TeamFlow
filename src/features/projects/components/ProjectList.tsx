"use client";

import { useProjects } from "../hooks/useProjects";
import { ProjectCard } from "./ProjectCard";

interface ProjectListProps {
  onEdit: (projectId: string) => void;
  onDelete: (projectId: string) => void;
  onCreateClick: () => void;
}

export function ProjectList({ onEdit, onDelete, onCreateClick }: ProjectListProps) {
  const { data: projects, isLoading, error } = useProjects();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse overflow-hidden rounded-xl border border-gray-700 bg-gray-800/50"
          >
            <div className="space-y-4 p-6">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-gray-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-6 w-3/4 rounded bg-gray-700" />
                  <div className="h-4 w-full rounded bg-gray-700" />
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-700" />
              <div className="h-2 w-full rounded-full bg-gray-700" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-6 text-center">
        <svg
          className="mx-auto mb-3 h-12 w-12 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="font-medium text-red-300">プロジェクトの読み込みに失敗しました</p>
        <p className="mt-1 text-sm text-red-400">{error.message}</p>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-700 bg-gray-800/30 p-12 text-center">
        <svg
          className="mx-auto mb-4 h-16 w-16 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
          />
        </svg>
        <h3 className="mb-2 text-lg font-medium text-gray-200">プロジェクトがありません</h3>
        <p className="mb-6 text-gray-400">最初のプロジェクトを作成してタスク管理を始めましょう</p>
        <button
          onClick={onCreateClick}
          className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 text-white shadow-lg transition-all hover:from-blue-600 hover:to-purple-600"
        >
          <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新規プロジェクト作成
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
