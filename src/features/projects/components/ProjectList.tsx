"use client";

import { useProjects } from "../hooks/useProjects";
import { ProjectCard } from "./ProjectCard";

interface ProjectListProps {
  onEdit: (projectId: string) => void;
  onDelete: (projectId: string) => void;
  onCreateClick: () => void;
}

export function ProjectList({
  onEdit,
  onDelete,
  onCreateClick,
}: ProjectListProps) {
  const { data: projects, isLoading, error } = useProjects();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden animate-pulse"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 bg-gray-700 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-6 bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-700 rounded w-full" />
                </div>
              </div>
              <div className="h-2 bg-gray-700 rounded-full w-full" />
              <div className="h-2 bg-gray-700 rounded-full w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 text-center">
        <svg
          className="w-12 h-12 text-red-400 mx-auto mb-3"
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
        <p className="text-red-300 font-medium">
          プロジェクトの読み込みに失敗しました
        </p>
        <p className="text-red-400 text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="bg-gray-800/30 border-2 border-dashed border-gray-700 rounded-lg p-12 text-center">
        <svg
          className="w-16 h-16 text-gray-600 mx-auto mb-4"
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
        <h3 className="text-lg font-medium text-gray-200 mb-2">
          プロジェクトがありません
        </h3>
        <p className="text-gray-400 mb-6">
          最初のプロジェクトを作成してタスク管理を始めましょう
        </p>
        <button
          onClick={onCreateClick}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          新規プロジェクト作成
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
