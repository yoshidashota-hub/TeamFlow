"use client";

import { useTaskFilters } from "../hooks/useTaskFilters";
import { useAllTags } from "../hooks/useTasks";
import { trpc } from "@/shared/lib/trpc";
import { Search, Filter } from "lucide-react";
import { TaskStatus, TaskPriority } from "../types";
import Image from "next/image";

export function TaskFilters() {
  const {
    filters,
    showDetailedFilters,
    setSearch,
    setStatusFilter,
    setPriorityFilter,
    setProjectFilter,
    setAssigneeFilter,
    setTagFilter,
    toggleDetailedFilters,
  } = useTaskFilters();

  const { tags } = useAllTags();
  const { data: projects } = trpc.projects.list.useQuery();
  const { data: users } = trpc.auth.getUsers.useQuery();

  const handleStatusToggle = (status: string) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status];
    setStatusFilter(newStatus);
  };

  const handlePriorityToggle = (priority: string) => {
    const newPriority = filters.priority.includes(priority)
      ? filters.priority.filter((p) => p !== priority)
      : [...filters.priority, priority];
    setPriorityFilter(newPriority);
  };

  const handleProjectToggle = (projectId: string) => {
    const newProjects = filters.projectIds.includes(projectId)
      ? filters.projectIds.filter((p) => p !== projectId)
      : [...filters.projectIds, projectId];
    setProjectFilter(newProjects);
  };

  const handleAssigneeToggle = (assigneeId: string) => {
    const newAssignees = filters.assigneeIds.includes(assigneeId)
      ? filters.assigneeIds.filter((a) => a !== assigneeId)
      : [...filters.assigneeIds, assigneeId];
    setAssigneeFilter(newAssignees);
  };

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    setTagFilter(newTags);
  };

  return (
    <div className="space-y-4">
      {/* 検索バー */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
          <input
            type="text"
            placeholder="タスクを検索..."
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-xl py-3 px-12 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>
        <button
          type="button"
          onClick={toggleDetailedFilters}
          aria-label={showDetailedFilters ? "詳細フィルターを非表示" : "詳細フィルターを表示"}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors ${
            showDetailedFilters
              ? "bg-purple-500/10 border-purple-500/50 text-purple-400"
              : "bg-white/[0.02] border-white/10 text-gray-400 hover:border-purple-500/50 hover:text-purple-400"
          }`}
        >
          <Filter className="w-5 h-5" />
          <span className="text-sm font-medium">
            {showDetailedFilters ? "詳細を非表示" : "詳細フィルター"}
          </span>
        </button>
      </div>

      {/* 詳細フィルター */}
      {showDetailedFilters && (
        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-xl p-6 space-y-6">
          {/* ステータス */}
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-3">ステータス</h3>
            <div className="flex flex-wrap gap-2">
              {Object.values(TaskStatus).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => handleStatusToggle(status)}
                  aria-label={`ステータス: ${status}`}
                  className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                    filters.status.includes(status)
                      ? "bg-white/10 border-white/20 text-white"
                      : "bg-white/[0.02] border-white/10 text-gray-400 hover:bg-white/5"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* 優先度 */}
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-3">優先度</h3>
            <div className="flex flex-wrap gap-2">
              {Object.values(TaskPriority).map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => handlePriorityToggle(priority)}
                  aria-label={`優先度: ${priority}`}
                  className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                    filters.priority.includes(priority)
                      ? "bg-white/10 border-white/20 text-white"
                      : "bg-white/[0.02] border-white/10 text-gray-400 hover:bg-white/5"
                  }`}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>

          {/* プロジェクト */}
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-3">
              プロジェクト
            </h3>
            <div className="flex flex-wrap gap-2">
              {projects?.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => handleProjectToggle(project.id)}
                  aria-label={`プロジェクト: ${project.name}`}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-colors ${
                    filters.projectIds.includes(project.id)
                      ? "bg-white/10 border-white/20 text-white"
                      : "bg-white/[0.02] border-white/10 text-gray-400 hover:bg-white/5"
                  }`}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  {project.name}
                </button>
              ))}
            </div>
          </div>

          {/* 担当者 */}
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-3">担当者</h3>
            <div className="flex flex-wrap gap-2">
              {users?.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleAssigneeToggle(user.id)}
                  aria-label={`担当者: ${user.name}`}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-colors ${
                    filters.assigneeIds.includes(user.id)
                      ? "bg-white/10 border-white/20 text-white"
                      : "bg-white/[0.02] border-white/10 text-gray-400 hover:bg-white/5"
                  }`}
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || ""}
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <span className="text-xs text-purple-400">
                        {user.name?.[0] || "?"}
                      </span>
                    </div>
                  )}
                  {user.name}
                </button>
              ))}
            </div>
          </div>

          {/* タグ */}
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-3">タグ</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  aria-label={`タグ: ${tag}`}
                  className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                    filters.tags.includes(tag)
                      ? "bg-white/10 border-white/20 text-white"
                      : "bg-white/[0.02] border-white/10 text-gray-400 hover:bg-white/5"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
