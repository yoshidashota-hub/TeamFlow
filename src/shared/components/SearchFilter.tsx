"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Badge } from "@/shared/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/components/ui/dialog";
import { Search, X, Save, Filter } from "lucide-react";
import type { TaskWithRelations } from "@/features/tasks/types";
import type { ProjectWithTaskStats } from "@/features/projects";

export interface FilterState {
  searchText: string;
  status: string[];
  priority: string[];
  projectId: string[];
  assigneeId: string[];
  tags: string[];
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: FilterState;
}

interface SearchFilterProps {
  tasks: TaskWithRelations[];
  projects: ProjectWithTaskStats[];
  onFilterChange: (filters: FilterState) => void;
}

const initialFilters: FilterState = {
  searchText: "",
  status: [],
  priority: [],
  projectId: [],
  assigneeId: [],
  tags: [],
};

// ローカルストレージキー
const SAVED_SEARCHES_KEY = "teamflow_saved_searches";

export function SearchFilter({ tasks, projects, onFilterChange }: SearchFilterProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem(SAVED_SEARCHES_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // ユニークなタグを取得
  const allTags = Array.from(new Set(tasks.flatMap((t) => t.tags)));

  // ユニークな担当者を取得
  const allAssignees = Array.from(
    new Map(tasks.map((t) => [t.assigneeId, t.assignee])).values()
  );

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleArrayFilter = <K extends keyof FilterState>(
    key: K,
    value: string,
    currentArray: string[]
  ) => {
    const newArray = currentArray.includes(value)
      ? currentArray.filter((v) => v !== value)
      : [...currentArray, value];
    updateFilter(key, newArray as FilterState[K]);
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    onFilterChange(initialFilters);
  };

  const hasActiveFilters =
    filters.searchText ||
    filters.status.length > 0 ||
    filters.priority.length > 0 ||
    filters.projectId.length > 0 ||
    filters.assigneeId.length > 0 ||
    filters.tags.length > 0;

  const handleSaveSearch = () => {
    if (searchName.trim()) {
      const newSearch: SavedSearch = {
        id: `s${Date.now()}`,
        name: searchName.trim(),
        filters,
      };
      const updatedSearches = [...savedSearches, newSearch];
      setSavedSearches(updatedSearches);
      localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(updatedSearches));
      setSearchName("");
      setShowSaveDialog(false);
    }
  };

  const handleLoadSearch = (search: SavedSearch) => {
    setFilters(search.filters);
    onFilterChange(search.filters);
  };

  return (
    <div className="space-y-4">
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              <Search className="h-5 w-5 text-primary" />
              検索・フィルター
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="border-border/50 hover:border-primary/50 hover:bg-primary/10"
            >
              <Filter className="mr-2 h-4 w-4" />
              {showAdvanced ? "詳細を非表示" : "詳細フィルター"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="タスクを検索..."
              value={filters.searchText}
              onChange={(e) => updateFilter("searchText", e.target.value)}
              className="flex-1 border-border/50 bg-accent/30 focus:border-primary/50"
            />
            {hasActiveFilters && (
              <>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="border-border/50 hover:border-red-500/50 hover:bg-red-500/10"
                >
                  <X className="mr-2 h-4 w-4" />
                  クリア
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowSaveDialog(true)}
                  className="border-border/50 hover:border-primary/50 hover:bg-primary/10"
                >
                  <Save className="mr-2 h-4 w-4" />
                  保存
                </Button>
              </>
            )}
          </div>

          {showAdvanced && (
            <div className="grid grid-cols-1 gap-4 border-t pt-4 md:grid-cols-2 lg:grid-cols-3">
              {/* ステータス */}
              <div className="space-y-2">
                <Label>ステータス</Label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "未着手", label: "未着手" },
                    { value: "進行中", label: "進行中" },
                    { value: "レビュー", label: "レビュー" },
                    { value: "完了", label: "完了" },
                  ].map(({ value, label }) => (
                    <Badge
                      key={value}
                      variant={filters.status.includes(value) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleArrayFilter("status", value, filters.status)}
                    >
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* 優先度 */}
              <div className="space-y-2">
                <Label>優先度</Label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "低", label: "低" },
                    { value: "中", label: "中" },
                    { value: "高", label: "高" },
                    { value: "緊急", label: "緊急" },
                  ].map(({ value, label }) => (
                    <Badge
                      key={value}
                      variant={filters.priority.includes(value) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleArrayFilter("priority", value, filters.priority)}
                    >
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* プロジェクト */}
              <div className="space-y-2">
                <Label>プロジェクト</Label>
                <div className="flex flex-wrap gap-2">
                  {projects.map((project) => (
                    <Badge
                      key={project.id}
                      variant={filters.projectId.includes(project.id) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() =>
                        toggleArrayFilter("projectId", project.id, filters.projectId)
                      }
                    >
                      <div
                        className="mr-1 h-2 w-2 rounded-full"
                        style={{ backgroundColor: project.color }}
                      />
                      {project.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* 担当者 */}
              <div className="space-y-2">
                <Label>担当者</Label>
                <div className="flex flex-wrap gap-2">
                  {allAssignees.map((assignee) => (
                    <Badge
                      key={assignee.id}
                      variant={filters.assigneeId.includes(assignee.id) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() =>
                        toggleArrayFilter("assigneeId", assignee.id, filters.assigneeId)
                      }
                    >
                      {assignee.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* タグ */}
              <div className="space-y-2">
                <Label>タグ</Label>
                <div className="flex flex-wrap gap-2">
                  {allTags.slice(0, 10).map((tag) => (
                    <Badge
                      key={tag}
                      variant={filters.tags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleArrayFilter("tags", tag, filters.tags)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 保存された検索 */}
          {savedSearches.length > 0 && (
            <div className="border-t pt-4">
              <Label className="mb-2 block">保存された検索</Label>
              <div className="flex flex-wrap gap-2">
                {savedSearches.map((search) => (
                  <Button
                    key={search.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleLoadSearch(search)}
                  >
                    {search.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 保存ダイアログ */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>検索条件を保存</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="search-name">検索名</Label>
            <Input
              id="search-name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="例: 高優先度の未完了タスク"
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              キャンセル
            </Button>
            <Button onClick={handleSaveSearch}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
