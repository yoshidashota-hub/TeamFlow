import { prisma } from "@/shared/lib/prisma";
import { TRPCError } from "@trpc/server";
import type {
  CreateTaskInput,
  UpdateTaskInput,
  GetTasksInput,
} from "../types";

export class TaskService {
  // タスク一覧取得（検索・フィルター対応）
  static async list(userId: string, filters: GetTasksInput) {
    const { search, status, priority, projectIds, assigneeIds, tags } = filters;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    // ユーザーがアクセスできるプロジェクトのタスクのみ取得
    where.project = {
      ownerId: userId,
    };

    // 検索条件
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // フィルター条件
    if (status && status.length > 0) {
      where.status = { in: status };
    }

    if (priority && priority.length > 0) {
      where.priority = { in: priority };
    }

    if (projectIds && projectIds.length > 0) {
      where.projectId = { in: projectIds };
    }

    if (assigneeIds && assigneeIds.length > 0) {
      where.assigneeId = { in: assigneeIds };
    }

    if (tags && tags.length > 0) {
      where.tags = { hasSome: tags };
    }

    return prisma.task.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // タスク取得（単体）
  static async getById(id: string, userId: string) {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true,
            ownerId: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    if (!task) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "タスクが見つかりません",
      });
    }

    // プロジェクトのオーナーのみアクセス可能
    if (task.project.ownerId !== userId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "アクセス権限がありません",
      });
    }

    return task;
  }

  // タスク作成
  static async create(input: CreateTaskInput, userId: string) {
    // プロジェクトの所有権確認
    const project = await prisma.project.findUnique({
      where: { id: input.projectId },
    });

    if (!project) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "プロジェクトが見つかりません",
      });
    }

    if (project.ownerId !== userId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "このプロジェクトにタスクを作成する権限がありません",
      });
    }

    return prisma.task.create({
      data: {
        title: input.title,
        description: input.description,
        projectId: input.projectId,
        assigneeId: input.assigneeId,
        status: input.status,
        priority: input.priority,
        dueDate: input.dueDate,
        estimatedHours: input.estimatedHours,
        progress: input.progress,
        tags: input.tags,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
  }

  // タスク更新
  static async update(id: string, input: UpdateTaskInput, userId: string) {
    // 権限チェック
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            ownerId: true,
          },
        },
      },
    });

    if (!task) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "タスクが見つかりません",
      });
    }

    if (task.project.ownerId !== userId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "更新権限がありません",
      });
    }

    // プロジェクト変更時の権限チェック
    if (input.projectId && input.projectId !== task.projectId) {
      const newProject = await prisma.project.findUnique({
        where: { id: input.projectId },
      });

      if (!newProject) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "移動先のプロジェクトが見つかりません",
        });
      }

      if (newProject.ownerId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "移動先のプロジェクトへのアクセス権限がありません",
        });
      }
    }

    // 更新実行
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _taskId, ...updateData } = input;

    return prisma.task.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
  }

  // タスク削除
  static async delete(id: string, userId: string) {
    // 権限チェック
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            ownerId: true,
          },
        },
      },
    });

    if (!task) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "タスクが見つかりません",
      });
    }

    if (task.project.ownerId !== userId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "削除権限がありません",
      });
    }

    // 削除実行
    await prisma.task.delete({
      where: { id },
    });

    return { success: true };
  }

  // 全タグ取得
  static async getAllTags(userId: string) {
    const tasks = await prisma.task.findMany({
      where: {
        project: {
          ownerId: userId,
        },
      },
      select: {
        tags: true,
      },
    });

    // 全タスクからタグを収集して重複を除去
    const allTags = tasks.flatMap((task) => task.tags);
    const uniqueTags = Array.from(new Set(allTags));

    return uniqueTags;
  }
}
