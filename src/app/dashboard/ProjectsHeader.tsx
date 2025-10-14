"use client";

interface ProjectsHeaderProps {
  onCreateClick: () => void;
}

export function ProjectsHeader({ onCreateClick }: ProjectsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="mt-2 text-white text-lg">
          プロジェクトを選択してタスク管理を始めましょう
        </p>
      </div>

      <button
        onClick={onCreateClick}
        className="inline-flex items-center px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors shadow-sm hover:shadow-md"
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
        新規プロジェクト
      </button>
    </div>
  );
}
