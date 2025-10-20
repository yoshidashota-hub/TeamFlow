"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useCreateProject } from "../hooks/useProjectMutations";

const PRESET_COLORS = [
  "#3B82F6", // 青
  "#10B981", // 緑
  "#F59E0B", // 黄
  "#EF4444", // 赤
  "#8B5CF6", // 紫
  "#EC4899", // ピンク
  "#14B8A6", // シアン
  "#F97316", // オレンジ
  "#6366F1", // インディゴ
  "#84CC16", // ライムグリーン
];

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateProjectModal({
  isOpen,
  onClose,
}: CreateProjectModalProps) {
  const createProject = useCreateProject();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#3B82F6",
    startDate: "",
    endDate: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = "プロジェクト名は必須です";
    }
    if (formData.name.length > 100) {
      newErrors.name = "プロジェクト名は100文字以内で入力してください";
    }
    if (formData.description.length > 500) {
      newErrors.description = "説明は500文字以内で入力してください";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await createProject.mutateAsync({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        color: formData.color,
        startDate: formData.startDate ? new Date(formData.startDate) : undefined,
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      });

      setFormData({ name: "", description: "", color: "#3B82F6", startDate: "", endDate: "" });
      onClose();
    } catch (error) {
      console.error("プロジェクト作成エラー:", error);
      setErrors({ submit: "プロジェクトの作成に失敗しました" });
    }
  };

  const handleClose = () => {
    setFormData({ name: "", description: "", color: "#3B82F6", startDate: "", endDate: "" });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">新規プロジェクト作成</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              プロジェクト名
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="プロジェクト名を入力"
              maxLength={100}
            />
            {errors.name && (
              <p className="mt-1.5 text-sm text-red-400">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              説明
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
              placeholder="プロジェクトの詳細を入力"
              maxLength={500}
            />
            {errors.description && (
              <p className="mt-1.5 text-sm text-red-400">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              カラー
            </label>
            <div className="flex gap-2.5 flex-wrap">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-10 h-10 rounded-full transition-all ${
                    formData.color === color
                      ? "ring-2 ring-offset-2 ring-offset-gray-900 ring-white scale-110"
                      : "hover:scale-105 opacity-80 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`カラー ${color}`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                開始日
              </label>
              <input
                type="date"
                id="startDate"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                終了日
              </label>
              <input
                type="date"
                id="endDate"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {errors.submit && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
              <p className="text-sm text-red-400">{errors.submit}</p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors font-medium"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={createProject.isPending}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createProject.isPending ? "作成中..." : "作成"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
