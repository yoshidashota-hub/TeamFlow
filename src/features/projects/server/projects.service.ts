import { prisma } from "@/shared/lib/prisma";
import { TRPCError } from "@trpc/server";
import type {
  CreateProjectInput,
  UpdateProjectInput,
} from "../types/project.types";

export class ProjectService {
  // プロジェクト一覧取得
  static async list(userId: string) {
    return prisma.project.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" },
    });
  }

  // プロジェクト取得（単体）
  static async getById(id: string, userId: string) {
    const project = await prisma.project.findUnique({
      where: { id },
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
        message: "アクセス権限がありません",
      });
    }

    return project;
  }

  // プロジェクト作成
  static async create(input: CreateProjectInput, userId: string) {
    return prisma.project.create({
      data: {
        name: input.name,
        description: input.description,
        color: input.color || "#3B82F6",
        startDate: input.startDate,
        endDate: input.endDate,
        ownerId: userId,
      },
    });
  }

  // プロジェクト更新
  static async update(
    id: string,
    input: Partial<UpdateProjectInput>,
    userId: string
  ) {
    // 権限チェック
    const project = await prisma.project.findUnique({
      where: { id },
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
        message: "更新権限がありません",
      });
    }

    // 更新実行
    return prisma.project.update({
      where: { id },
      data: {
        name: input.name,
        description: input.description,
        color: input.color,
        startDate: input.startDate,
        endDate: input.endDate,
        updatedAt: new Date(),
      },
    });
  }

  // プロジェクト削除
  static async delete(id: string, userId: string) {
    // 権限チェック
    const project = await prisma.project.findUnique({
      where: { id },
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
        message: "削除権限がありません",
      });
    }

    // 削除実行
    await prisma.project.delete({
      where: { id },
    });

    return { success: true };
  }
}
