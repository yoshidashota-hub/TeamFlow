"use client";

import { useState } from "react";
import { parseISO } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { FormField } from "@/shared/components/ui/form-field";
import { ColorPicker } from "@/shared/components/ui/color-picker";
import { useCreateProject } from "../hooks/useProjectMutations";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
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
        startDate: formData.startDate ? parseISO(formData.startDate) : undefined,
        endDate: formData.endDate ? parseISO(formData.endDate) : undefined,
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
      <DialogContent className="max-w-lg border-gray-800 bg-gray-900 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">新規プロジェクト作成</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-2 space-y-5">
          <FormField label="プロジェクト名" htmlFor="name" error={errors.name} required>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="プロジェクト名を入力"
              maxLength={100}
              className="border-gray-700 bg-gray-800 text-white"
            />
          </FormField>

          <FormField label="説明" htmlFor="description" error={errors.description}>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="プロジェクトの詳細を入力"
              maxLength={500}
              className="border-gray-700 bg-gray-800 text-white"
            />
          </FormField>

          <div>
            <label className="mb-3 block text-sm font-medium text-gray-300">カラー</label>
            <ColorPicker
              value={formData.color}
              onChange={(color) => setFormData({ ...formData, color })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="開始日" htmlFor="startDate">
              <Input
                type="date"
                id="startDate"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="border-gray-700 bg-gray-800 text-white"
              />
            </FormField>
            <FormField label="終了日" htmlFor="endDate">
              <Input
                type="date"
                id="endDate"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="border-gray-700 bg-gray-800 text-white"
              />
            </FormField>
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
              loading={createProject.isPending}
              disabled={createProject.isPending}
            >
              {createProject.isPending ? "作成中..." : "作成"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
