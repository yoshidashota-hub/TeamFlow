import type { Task as PrismaTask } from "@prisma/client";
import { z } from "zod";

// ============================================
// Prisma Model Type
// ============================================

export type Task = PrismaTask;

// ============================================
// Constants
// ============================================

// タスクステータス
export const TaskStatus = {
  NOT_STARTED: "未着手",
  IN_PROGRESS: "進行中",
  REVIEW: "レビュー",
  COMPLETED: "完了",
} as const;

export type TaskStatusType = (typeof TaskStatus)[keyof typeof TaskStatus];

// タスク優先度
export const TaskPriority = {
  LOW: "低",
  MEDIUM: "中",
  HIGH: "高",
  URGENT: "緊急",
} as const;

export type TaskPriorityType = (typeof TaskPriority)[keyof typeof TaskPriority];

// ============================================
// Zod Schemas (バリデーション & 型生成)
// ============================================
export const createTaskSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  description: z.string().optional(),
  projectId: z.string().min(1, "プロジェクトは必須です"),
  assigneeId: z.string().min(1, "担当者は必須です"),
  status: z.string().default(TaskStatus.NOT_STARTED),
  priority: z.string().default(TaskPriority.MEDIUM),
  dueDate: z.date().optional(),
  estimatedHours: z.number().int().min(0).optional(),
  progress: z.number().int().min(0).max(100).default(0),
  tags: z.array(z.string()).default([]),
});

export const updateTaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  projectId: z.string().optional(),
  assigneeId: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  dueDate: z.date().optional().nullable(),
  estimatedHours: z.number().int().min(0).optional().nullable(),
  progress: z.number().int().min(0).max(100).optional(),
  tags: z.array(z.string()).optional(),
});

export const deleteTaskSchema = z.object({
  id: z.string(),
});

export const getTasksSchema = z.object({
  search: z.string().optional(),
  status: z.array(z.string()).optional(),
  priority: z.array(z.string()).optional(),
  projectIds: z.array(z.string()).optional(),
  assigneeIds: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

// ============================================
// TypeScript Types
// ============================================

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type DeleteTaskInput = z.infer<typeof deleteTaskSchema>;
export type GetTasksInput = z.infer<typeof getTasksSchema>;

// リレーションを含むタスク型（API レスポンス用）
export type TaskWithRelations = Task & {
  project: {
    id: string;
    name: string;
    color: string;
  };
  assignee: {
    id: string;
    name: string | null;
    image: string | null;
  };
};
