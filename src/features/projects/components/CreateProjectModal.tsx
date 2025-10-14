"use client";

import { useState } from "react";
import { Modal } from "@/shared/components/Modal";
import { Button } from "@/shared/components/Button";
import { useCreateProject } from "../hooks/useProjectMutations";

const PRESET_COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#6366F1",
  "#14B8A6",
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
      });

      setFormData({ name: "", description: "", color: "#3B82F6" });
      onClose();
    } catch (error) {
      console.error("プロジェクト作成エラー:", error);
      setErrors({ submit: "プロジェクトの作成に失敗しました" });
    }
  };

  const handleClose = () => {
    setFormData({ name: "", description: "", color: "#3B82F6" });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="新規プロジェクト作成">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            プロジェクト名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="例: ウェブサイトリニューアル"
            maxLength={100}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            説明（オプション）
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="プロジェクトの詳細を入力..."
            maxLength={500}
          />
          <div className="flex justify-between mt-1">
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description}</p>
            )}
            <p className="text-xs text-gray-500 ml-auto">
              {formData.description.length}/500
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            カラー
          </label>
          <div className="flex gap-2">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setFormData({ ...formData, color })}
                className={`w-10 h-10 rounded-lg transition-all ${
                  formData.color === color
                    ? "ring-2 ring-offset-2 ring-gray-900 scale-110"
                    : "hover:scale-105"
                }`}
                style={{ backgroundColor: color }}
                aria-label={`カラー ${color}`}
              />
            ))}
          </div>
        </div>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800">{errors.submit}</p>
          </div>
        )}

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
            isLoading={createProject.isPending}
            className="flex-1"
          >
            作成
          </Button>
        </div>
      </form>
    </Modal>
  );
}
