"use client";

import { useTaskFilters } from "../hooks/useTaskFilters";
import { useAllTags } from "../hooks/useTasks";
import { trpc } from "@/shared/lib/trpc";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
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
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-4 z-10 h-5 w-5 -translate-y-1/2 text-purple-400" />
          <Input
            type="text"
            placeholder="タスクを検索..."
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-white/10 bg-white/[0.02] pl-12 text-white backdrop-blur-xl"
          />
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={toggleDetailedFilters}
          aria-label={showDetailedFilters ? "詳細フィルターを非表示" : "詳細フィルターを表示"}
          className={`gap-2 ${
            showDetailedFilters
              ? "border-purple-500/50 bg-purple-500/10 text-purple-400"
              : "border-white/10 text-gray-400 hover:border-purple-500/50 hover:text-purple-400"
          }`}
        >
          <Filter className="h-5 w-5" />
          <span className="text-sm font-medium">
            {showDetailedFilters ? "詳細を非表示" : "詳細フィルター"}
          </span>
        </Button>
      </div>

      {/* 詳細フィルター */}
      {showDetailedFilters && (
        <div className="space-y-6 rounded-xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
          {/* ステータス */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-gray-300">ステータス</h3>
            <div className="flex flex-wrap gap-2">
              {Object.values(TaskStatus).map((status) => (
                <Button
                  key={status}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleStatusToggle(status)}
                  aria-label={`ステータス: ${status}`}
                  className={`${
                    filters.status.includes(status)
                      ? "border-white/20 bg-white/10 text-white"
                      : "border-white/10 bg-white/[0.02] text-gray-400 hover:bg-white/5"
                  }`}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>

          {/* 優先度 */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-gray-300">優先度</h3>
            <div className="flex flex-wrap gap-2">
              {Object.values(TaskPriority).map((priority) => (
                <Button
                  key={priority}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePriorityToggle(priority)}
                  aria-label={`優先度: ${priority}`}
                  className={`${
                    filters.priority.includes(priority)
                      ? "border-white/20 bg-white/10 text-white"
                      : "border-white/10 bg-white/[0.02] text-gray-400 hover:bg-white/5"
                  }`}
                >
                  {priority}
                </Button>
              ))}
            </div>
          </div>

          {/* プロジェクト */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-gray-300">プロジェクト</h3>
            <div className="flex flex-wrap gap-2">
              {projects?.map((project) => (
                <Button
                  key={project.id}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleProjectToggle(project.id)}
                  aria-label={`プロジェクト: ${project.name}`}
                  className={`gap-2 ${
                    filters.projectIds.includes(project.id)
                      ? "border-white/20 bg-white/10 text-white"
                      : "border-white/10 bg-white/[0.02] text-gray-400 hover:bg-white/5"
                  }`}
                >
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  {project.name}
                </Button>
              ))}
            </div>
          </div>

          {/* 担当者 */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-gray-300">担当者</h3>
            <div className="flex flex-wrap gap-2">
              {users?.map((user) => (
                <Button
                  key={user.id}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAssigneeToggle(user.id)}
                  aria-label={`担当者: ${user.name}`}
                  className={`gap-2 ${
                    filters.assigneeIds.includes(user.id)
                      ? "border-white/20 bg-white/10 text-white"
                      : "border-white/10 bg-white/[0.02] text-gray-400 hover:bg-white/5"
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
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500/20">
                      <span className="text-xs text-purple-400">{user.name?.[0] || "?"}</span>
                    </div>
                  )}
                  {user.name}
                </Button>
              ))}
            </div>
          </div>

          {/* タグ */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-gray-300">タグ</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Button
                  key={tag}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTagToggle(tag)}
                  aria-label={`タグ: ${tag}`}
                  className={`${
                    filters.tags.includes(tag)
                      ? "border-white/20 bg-white/10 text-white"
                      : "border-white/10 bg-white/[0.02] text-gray-400 hover:bg-white/5"
                  }`}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
