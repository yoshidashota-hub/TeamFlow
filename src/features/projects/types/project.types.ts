import type { Project as PrismaProject } from "@prisma/client";
import { z } from "zod";

// ============================================
// Prisma Model Type
// ============================================

export type Project = PrismaProject;

// ============================================
// Zod Schemas (バリデーション & 型生成)
// ============================================

export const createProjectSchema = z.object({
  name: z.string().min(1, "名前は必須です").max(100, "名前は100文字以内です"),
  description: z.string().max(500, "説明は500文字以内です").optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "正しいカラーコードを入力してください")
    .optional(),
});

export const updateProjectSchema = z.object({
  id: z.cuid(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i)
    .optional(),
});

export const deleteProjectSchema = z.object({
  id: z.cuid(),
});

// ============================================
// TypeScript Types
// ============================================

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type DeleteProjectInput = z.infer<typeof deleteProjectSchema>;
