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
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl font-medium"
      >
        <Plus className="w-5 h-5" />
        新規プロジェクト
      </button>
    </div>
  );
}
