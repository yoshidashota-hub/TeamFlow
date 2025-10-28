"use client";

import { Plus } from "lucide-react";

interface ProjectsHeaderProps {
  onCreateClick: () => void;
}

export function ProjectsHeader({ onCreateClick }: ProjectsHeaderProps) {
  return (
    <div className="flex items-center justify-end">
      <button
        type="button"
        onClick={onCreateClick}
        className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-5 py-2.5 font-medium text-white shadow-lg transition-all hover:from-blue-600 hover:to-purple-600 hover:shadow-xl"
      >
        <Plus className="h-5 w-5" />
        新規プロジェクト
      </button>
    </div>
  );
}
