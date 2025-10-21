import { router, protectedProcedure } from "@/server/trpc";
import {
  createTaskSchema,
  updateTaskSchema,
  deleteTaskSchema,
  getTasksSchema,
} from "../types";
import { TaskService } from "./task.service";

export const taskRouter = router({
  // タスク一覧取得（検索・フィルター対応）
  list: protectedProcedure
    .input(getTasksSchema)
    .query(async ({ ctx, input }) => {
      return TaskService.list(ctx.session.user.id!, input);
    }),

  // タスク取得（ID指定）
  getById: protectedProcedure
    .input(deleteTaskSchema)
    .query(async ({ ctx, input }) => {
      return TaskService.getById(input.id, ctx.session.user.id!);
    }),

  // タスク作成
  create: protectedProcedure
    .input(createTaskSchema)
    .mutation(async ({ ctx, input }) => {
      return TaskService.create(input, ctx.session.user.id!);
    }),

  // タスク更新
  update: protectedProcedure
    .input(updateTaskSchema)
    .mutation(async ({ ctx, input }) => {
      return TaskService.update(input.id, input, ctx.session.user.id!);
    }),

  // タスク削除
  delete: protectedProcedure
    .input(deleteTaskSchema)
    .mutation(async ({ ctx, input }) => {
      return TaskService.delete(input.id, ctx.session.user.id!);
    }),

  // 全タグ取得
  getAllTags: protectedProcedure.query(async ({ ctx }) => {
    return TaskService.getAllTags(ctx.session.user.id!);
  }),
});
