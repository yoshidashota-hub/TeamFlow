"use client";

import { useState, useEffect } from "react";
import { useTaskStore } from "../store/taskStore";
import { useCreateTask, useUpdateTask, useTask } from "../hooks/useTasks";
import { trpc } from "@/shared/lib/trpc";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import { X } from "lucide-react";
import { TaskStatus, TaskPriority } from "../types";

export function CreateTaskModal() {
  const isOpen = useTaskStore((state) => state.isCreateModalOpen);
  const editingTaskId = useTaskStore((state) => state.editingTaskId);
  const closeModal = useTaskStore((state) => state.closeCreateModal);

  const { task } = useTask(editingTaskId);
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  const { data: projects } = trpc.projects.list.useQuery();
  const { data: users } = trpc.auth.getUsers.useQuery();

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    projectId: string;
    assigneeId: string;
    status: string;
    priority: string;
    startDate: string;
    dueDate: string;
    estimatedHours: string;
    tags: string;
  }>({
    title: "",
    description: "",
    projectId: "",
    assigneeId: "",
    status: TaskStatus.NOT_STARTED,
    priority: TaskPriority.MEDIUM,
    startDate: "",
    dueDate: "",
    estimatedHours: "",
    tags: "",
  });

  // 編集時にタスクデータをフォームに反映
  useEffect(() => {
    if (task && editingTaskId) {
      setFormData({
        title: task.title,
        description: task.description || "",
        projectId: task.projectId,
        assigneeId: task.assigneeId,
        status: task.status,
        priority: task.priority,
        startDate: task.startDate
          ? new Date(task.startDate).toISOString().split("T")[0]
          : "",
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().split("T")[0]
          : "",
        estimatedHours: task.estimatedHours?.toString() || "",
        tags: task.tags.join(", "),
      });
    }
  }, [task, editingTaskId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const tags = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const data = {
      title: formData.title,
      description: formData.description || undefined,
      projectId: formData.projectId,
      assigneeId: formData.assigneeId,
      status: formData.status,
      priority: formData.priority,
      startDate: formData.startDate ? new Date(formData.startDate) : undefined,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      estimatedHours: formData.estimatedHours
        ? parseInt(formData.estimatedHours)
        : undefined,
      tags,
    };

    if (editingTaskId) {
      updateTask.mutate({ id: editingTaskId, ...data });
    } else {
      createTask.mutate(data);
    }
  };

  const handleClose = () => {
    closeModal();
    setFormData({
      title: "",
      description: "",
      projectId: "",
      assigneeId: "",
      status: TaskStatus.NOT_STARTED,
      priority: TaskPriority.MEDIUM,
      startDate: "",
      dueDate: "",
      estimatedHours: "",
      tags: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* オーバーレイ */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* モーダル */}
      <div className="relative bg-[#0A0A0F] border border-white/10 rounded-2xl w-full max-w-2xl mx-4 shadow-2xl">
        {/* ヘッダー */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">
            {editingTaskId ? "タスク編集" : "新規タスク作成"}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="モーダルを閉じる"
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* タイトル */}
          <div className="space-y-2">
            <Label htmlFor="task-title" className="text-gray-300">
              タイトル
            </Label>
            <Input
              id="task-title"
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="タスクのタイトルを入力"
              className="bg-white/[0.02] border-purple-500/50 text-white"
            />
          </div>

          {/* 説明 */}
          <div className="space-y-2">
            <Label htmlFor="task-description" className="text-gray-300">
              説明
            </Label>
            <Textarea
              id="task-description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="タスクの詳細を入力"
              rows={3}
              className="bg-[#1A1A24] border-white/10 text-white"
            />
          </div>

          {/* プロジェクトと担当者 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="task-project" className="block text-sm font-medium text-gray-300 mb-2">
                プロジェクト
              </label>
              <select
                id="task-project"
                required
                value={formData.projectId}
                onChange={(e) =>
                  setFormData({ ...formData, projectId: e.target.value })
                }
                className="w-full bg-[#1A1A24] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                <option value="">選択してください</option>
                {projects?.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="task-assignee" className="block text-sm font-medium text-gray-300 mb-2">
                担当者
              </label>
              <select
                id="task-assignee"
                required
                value={formData.assigneeId}
                onChange={(e) =>
                  setFormData({ ...formData, assigneeId: e.target.value })
                }
                className="w-full bg-[#1A1A24] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                <option value="">選択してください</option>
                {users?.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ステータスと優先度 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="task-status" className="block text-sm font-medium text-gray-300 mb-2">
                ステータス
              </label>
              <select
                id="task-status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full bg-[#1A1A24] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                {Object.values(TaskStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="task-priority" className="block text-sm font-medium text-gray-300 mb-2">
                優先度
              </label>
              <select
                id="task-priority"
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className="w-full bg-[#1A1A24] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                {Object.values(TaskPriority).map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 開始日と期限 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="task-startdate" className="text-gray-300">
                開始日
              </Label>
              <Input
                type="date"
                id="task-startdate"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="bg-[#1A1A24] border-white/10 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-duedate" className="text-gray-300">
                期限
              </Label>
              <Input
                type="date"
                id="task-duedate"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                className="bg-[#1A1A24] border-white/10 text-white"
              />
            </div>
          </div>

          {/* 見積時間 */}
          <div className="space-y-2">
            <Label htmlFor="task-hours" className="text-gray-300">
              見積時間 (時間)
            </Label>
            <Input
              type="number"
              id="task-hours"
              min="0"
              value={formData.estimatedHours}
              onChange={(e) =>
                setFormData({ ...formData, estimatedHours: e.target.value })
              }
              placeholder="0"
              className="bg-[#1A1A24] border-white/10 text-white"
            />
          </div>

          {/* タグ */}
          <div className="space-y-2">
            <Label htmlFor="task-tags" className="text-gray-300">
              タグ (カンマ区切り)
            </Label>
            <Input
              type="text"
              id="task-tags"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              placeholder="例: デザイン, フロントエンド"
              className="bg-[#1A1A24] border-white/10 text-white"
            />
          </div>

          {/* ボタン */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              className="flex-1"
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={createTask.isPending || updateTask.isPending}
              loading={createTask.isPending || updateTask.isPending}
              className="flex-1"
            >
              {editingTaskId ? "更新" : "作成"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
