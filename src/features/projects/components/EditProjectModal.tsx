"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import { useProject } from "../hooks/useProjects";
import { useUpdateProject } from "../hooks/useProjectMutations";

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

interface EditProjectModalProps {
  isOpen: boolean;
  projectId: string | null;
  onClose: () => void;
}

export function EditProjectModal({ isOpen, projectId, onClose }: EditProjectModalProps) {
  const { data: project } = useProject(projectId || "");
  const updateProject = useUpdateProject();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#3B82F6",
    startDate: "",
    endDate: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description || "",
        color: project.color,
        startDate: project.startDate ? new Date(project.startDate).toISOString().split("T")[0] : "",
        endDate: project.endDate ? new Date(project.endDate).toISOString().split("T")[0] : "",
      });
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!projectId) return;

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
      await updateProject.mutateAsync({
        id: projectId,
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        color: formData.color,
        startDate: formData.startDate ? new Date(formData.startDate) : undefined,
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      });

      onClose();
    } catch (error) {
      console.error("プロジェクト更新エラー:", error);
      setErrors({ submit: "プロジェクトの更新に失敗しました" });
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!project) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-lg border-gray-800 bg-gray-900 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">プロジェクトを編集</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-2 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="text-gray-300">
              プロジェクト名
            </Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              maxLength={100}
              className="border-gray-700 bg-gray-800 text-white"
            />
            {errors.name && <p className="text-sm text-red-400">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description" className="text-gray-300">
              説明
            </Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              maxLength={500}
              className="border-gray-700 bg-gray-800 text-white"
            />
            {errors.description && <p className="text-sm text-red-400">{errors.description}</p>}
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-gray-300">カラー</label>
            <div className="flex flex-wrap gap-2.5">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  title={`カラー ${color}`}
                  onClick={() => setFormData({ ...formData, color })}
                  className={`h-10 w-10 rounded-full transition-all ${
                    formData.color === color
                      ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-gray-900"
                      : "opacity-80 hover:scale-105 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-startDate" className="text-gray-300">
                開始日
              </Label>
              <Input
                type="date"
                id="edit-startDate"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="border-gray-700 bg-gray-800 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-endDate" className="text-gray-300">
                終了日
              </Label>
              <Input
                type="date"
                id="edit-endDate"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="border-gray-700 bg-gray-800 text-white"
              />
            </div>
          </div>

          {errors.submit && (
            <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3">
              <p className="text-sm text-red-400">{errors.submit}</p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={handleClose}>
              キャンセル
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={updateProject.isPending}
              disabled={updateProject.isPending}
            >
              {updateProject.isPending ? "更新中..." : "更新"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
