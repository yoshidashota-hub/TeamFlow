import { prisma } from "@/shared/lib/prisma";
import type { TaskWithRelations } from "@/features/tasks/types";
import type { ProjectWithTaskStats } from "@/features/projects";

export class DashboardService {
  // ダッシュボード用のデータを一括取得
  static async getDashboardData(userId: string) {
    // タスク一覧取得（リレーション付き）
    const tasks = await prisma.task.findMany({
      where: {
        project: {
          ownerId: userId,
        },
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
      orderBy: {
        createdAt: "desc",
      },
    }) as TaskWithRelations[];

    // プロジェクト一覧取得（タスク統計付き）
    const projects = await prisma.project.findMany({
      where: {
        ownerId: userId,
      },
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });

    // プロジェクトごとのタスク統計を計算
    const projectsWithStats = await Promise.all(
      projects.map(async (project) => {
        const projectTasks = await prisma.task.findMany({
          where: {
            projectId: project.id,
          },
          select: {
            status: true,
          },
        });

        const notStarted = projectTasks.filter((t) => t.status === "未着手").length;
        const inProgress = projectTasks.filter((t) => t.status === "進行中").length;
        const completed = projectTasks.filter((t) => t.status === "完了").length;
        const totalTasks = projectTasks.length;
        const taskProgress = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;

        return {
          ...project,
          taskStats: {
            notStarted,
            inProgress,
            completed,
          },
          totalTasks,
          taskProgress,
        } as ProjectWithTaskStats;
      })
    );

    return {
      tasks,
      projects: projectsWithStats,
    };
  }
}
